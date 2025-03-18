import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";
import { DateTime } from "luxon";
import axios from "axios";
import { Client } from "@line/bot-sdk";

const prisma = new PrismaClient();

class NotificationService {
    private static instance: NotificationService;
    private client: Client;

    private constructor() {
        console.log("🚀 NotificationService initialized");

        this.client = new Client({
            channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "LineChannelAccessTOKEN",
        });

        this.scheduleTasks();
    }

    public static getInstance(): NotificationService {
        if (!globalThis.notificationService) {
            globalThis.notificationService = new NotificationService();
        }
        return globalThis.notificationService;
    }

    private async getPM25Config(): Promise<{ [key: string]: boolean }> {
        const configKeys = ["pm25config6", "pm25config12", "pm25config18"];
        const configs = await prisma.configuration.findMany({
            where: { key: { in: configKeys } },
            select: { key: true, value: true },
        });

        return configs.reduce((acc, config) => {
            acc[config.key] = config.value === "1";
            return acc;
        }, {} as { [key: string]: boolean });
    }

    private async runTask(timeKey: string) {
        const config = await this.getPM25Config();
        if (config[timeKey]) {
            
            const res = await axios.get(`https://api.waqi.info/feed/A365722/?token=${process.env.AQI_TOKEN}`);
            const aqi = res.data?.data?.iaqi?.pm25?.v;
            // const time = res.data?.data?.time?.s;
            const now = DateTime.now().setZone("Asia/Bangkok").toFormat("HH:mm:ss");
            console.log(`[${now}] Executing PM2.5 Notification Task for ${timeKey}`);
            
            if (!aqi) {
                console.error(`[${now}] ERROR: Missing AQI data.`);
                return;
            }

            let notificationAQIText = "";
            let aqiConfig = "aqi0";
            if (aqi <= 25) {
                notificationAQIText = "คุณภาพอากาศดีมาก เหมาะสำหรับกิจกรรมกลางแจ้ง" ;
                aqiConfig = "aqi0";
            }
            else if (aqi <= 50) {
                notificationAQIText = "คุณภาพอากาศดี สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ";
                aqiConfig = "aqi25";
            }
            else if (aqi <= 100) {
                notificationAQIText = "เฝ้าระวังอากาศหากมีอาการผิดปกติ";
                aqiConfig = "aqi50";
            }
            else if (aqi <= 200) {
                notificationAQIText = "หลีกเลี่ยงกิจกรรมกลางแจ้งหากเป็นไปได้";
                aqiConfig = "aqi100";
            }
            else {
                notificationAQIText = "อากาศอันตราย! ควรอยู่ในที่ปิดและใส่หน้ากาก";
                aqiConfig = "aqi200";
            }

            const notificationText = await prisma.configuration.findFirst({
                where: { key: aqiConfig },
            });

            if (notificationText) {
                notificationAQIText = notificationText.value;
            }

            console.log(`[${now}] AQI: ${aqi} - ${notificationAQIText}`);

            const users = await prisma.lineUser.findMany();

            const notifications = users.map((user) =>
                this.client.pushMessage(user.userId, {
                    type: "text",
                    text: `🌍 AQI Update (${now})\nAQI: ${aqi}\n${notificationAQIText}`,
                })
            );

            await Promise.all(notifications);
            console.log(`[${now}] Notifications sent successfully.`);
        } else {
            console.log(`Task for ${timeKey} is disabled in configuration.`);
        }
    }

    private scheduleTasks() {
        const timeConfig = {
            pm25config6: "0 6 * * *",
            pm25config12: "0 12 * * *",
            pm25config18: "0 18 * * *",
        };

        Object.entries(timeConfig).forEach(([key, cronTime]) => {
            new CronJob(
                cronTime,
                () => this.runTask(key),
                null,
                true,
                "Asia/Bangkok"
            );
            console.log(`Scheduled task for ${key} at ${cronTime} (Thai Time)`);
        });
    }
}

// Attach to `globalThis` to ensure only one instance exists
declare global {
    var notificationService: NotificationService | undefined;
}

export const notificationService = NotificationService;
