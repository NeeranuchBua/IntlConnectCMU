export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { withAuthAndAdmin, withAPIHandler } from '@/lib/middleware/apiWithMiddleware';
import { ApiError } from '@/types/api/apiError';
import { Client } from '@line/bot-sdk';
import axios from 'axios';
import { formatDateThai } from '@/lib/utils';

const client = new Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'ChannelAccessToken',
});

export const GET = withAPIHandler(withAuthAndAdmin(async () => {
    const res = (await axios.get(`https://api.waqi.info/feed/A468598/?token=${process.env.AQI_TOKEN}`)).data;
    const aqi = res.data?.iaqi?.pm25?.v as number;
    if (!aqi) {
        throw ApiError.badRequest('Missing required aqi fields.');
    }
    let notificationAQIText = "";
    const time = res.data?.time?.iso || new Date().toISOString();

    if (aqi >= 0 && aqi <= 25) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi0' }, });
        notificationAQIText = text?.value || 'คุณภาพอากาศดีมาก เหมาะสำหรับกิจกรรมกลางแจ้งและท่องเที่ยว';
    }
    else if (aqi > 25 && aqi <= 50) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi25' }, });
        notificationAQIText = text?.value || 'คุณภาพอากาศดี สามารถทำกิจกรรมกลางแจ้งและการท่องเที่ยวได้ตามปกติ';
    }
    else if (aqi > 50 && aqi <= 100) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi50' }, });
        notificationAQIText = text?.value || 'สำหรับประชาชนทั่วไป: สามารถทำกิจกรรมกลางแจ้งได้ปกติ...';
    }
    else if (aqi > 100 && aqi <= 200) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi100' }, });
        notificationAQIText = text?.value || 'ควรเฝ้าระวังสุขภาพ หากมีอาการควรลดกิจกรรมกลางแจ้ง...';
    }
    else if (aqi > 200) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi200' }, });
        notificationAQIText = text?.value || 'ทุกคนควรหลีกเลี่ยงกิจกรรมกลางแจ้ง หากมีอาการควรปรึกษาแพทย์';
    }
    return Response.json({ aqi, notificationAQIText, time });
}));

export const POST = withAPIHandler(withAuthAndAdmin(async () => {
    const res = (await axios.get(`https://api.waqi.info/feed/A468598/?token=${process.env.AQI_TOKEN}`)).data;
    const aqi = res.data?.iaqi?.pm25?.v as number;
    if (!aqi) {
        throw ApiError.badRequest('Missing required aqi fields.');
    }
    let notificationAQIText = "";
    const time = res.data?.time?.iso || new Date().toISOString();

    if (aqi >= 0 && aqi <= 25) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi0' }, });
        notificationAQIText = text?.value || 'Excellent air quality .. Ideal for outdoor activities and tourism.';
    }
    else if (aqi > 25 && aqi <= 50) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi25' }, });
        notificationAQIText = text?.value || 'Good air quality .. Outdoor activities and tourism can proceed as usual.';
    }
    else if (aqi > 50 && aqi <= 100) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi50' }, });
        notificationAQIText = text?.value || 'For the general public: Outdoor activities can be carried out normally....';
    }
    else if (aqi > 100 && aqi <= 200) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi100' }, });
        notificationAQIText = text?.value || 'Health precautions advised: If symptoms occur, outdoor activities should be reduced...';
    }
    else if (aqi > 200) {
        const text = await prisma.configuration.findFirst({ where: { key: 'aqi200' }, });
        notificationAQIText = text?.value || 'Everyone should avoid outdoor activities: If symptoms occur, consult a doctor.';
    }

    const notificationText = `Air Quality Index(AQI) Value : ${aqi}\n
Time: ${formatDateThai(new Date(time))}\n
Recommendation:\n
${notificationAQIText}`

    const users = await prisma.lineUser.findMany();

    const notifications = users.map((user: any) =>
        client.pushMessage(user.userId, { type: 'text', text: notificationText || 'Test Line Notifications' })
    );

    await Promise.all(notifications);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}));