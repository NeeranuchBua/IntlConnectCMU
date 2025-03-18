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
    const res = (await axios.get(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_TOKEN}&q=Chiang%20Mai&aqi=yes`)).data;
    const {precip_mm, temp_c, last_updated} = res?.current || {precip_mm: null, temp_c: null, last_updated: null};
    if (precip_mm === null || temp_c === null || last_updated === null) {
        throw ApiError.badRequest('Missing required weather fields.');
    }
    let notificationTemperatureText = "";
    let notificationPressureText = "";
    const time = last_updated;

    if (temp_c >= 35) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertexthot' }, });
        notificationTemperatureText = text?.value || 'The temperature is very high. It is recommended to avoid outdoor activities.';
    }
    else if (temp_c <= 22.9) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextcold' }, });
        notificationTemperatureText = text?.value || 'The temperature is very low. It is recommended to wear warm clothes.';
    }
    else {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextnormal' }, });
        notificationTemperatureText = text?.value || 'The temperature is normal. It is recommended to wear normal clothes.';
    }

    if (precip_mm >= 0.1 && precip_mm <= 35) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextrainlow' }, });
        notificationPressureText = text?.value || 'There is light rain. It is recommended to bring an umbrella.';
    }
    else if (precip_mm > 35) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextrainhigh' }, });
        notificationPressureText = text?.value || 'There is heavy rain. It is recommended to avoid traveling.';
    }
    else if (precip_mm <= 0) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextnorain' }, });
        notificationPressureText = text?.value || 'There is no rain. It is recommended to travel.';
    }
    return Response.json({ temp_c, precip_mm, temperatureText: notificationTemperatureText, pressureText: notificationPressureText, time });
}));

export const POST = withAPIHandler(withAuthAndAdmin(async () => {
    const res = (await axios.get(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_TOKEN}&q=Chiang%20Mai&aqi=yes`)).data;
    const {precip_mm, temp_c, last_updated} = res?.current || {precip_mm: null, temp_c: null, last_updated: null};
    if (precip_mm === null || temp_c === null || last_updated === null) {
        throw ApiError.badRequest('Missing required weather fields.');
    }
    let notificationTemperatureText = "";
    let notificationPressureText = "";
    const time = formatDateThai(new Date(last_updated));

    if (temp_c >= 35) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertexthot' }, });
        notificationTemperatureText = text?.value || 'The temperature is very high. It is recommended to avoid outdoor activities.';
    }
    else if (temp_c <= 22.9) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextcold' }, });
        notificationTemperatureText = text?.value || 'The temperature is very low. It is recommended to wear warm clothes.';
    }
    else {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextnormal' }, });
        notificationTemperatureText = text?.value || 'The temperature is normal. It is recommended to wear normal clothes.';
    }

    if (precip_mm >= 0.1 && precip_mm <= 35) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextrainlow' }, });
        notificationPressureText = text?.value || 'There is light rain. It is recommended to bring an umbrella.';
    }
    else if (precip_mm > 35) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextrainhigh' }, });
        notificationPressureText = text?.value || 'There is heavy rain. It is recommended to avoid traveling.';
    }
    else if (precip_mm <= 0) {
        const text = await prisma.configuration.findFirst({ where: { key: 'weathertextnorain' }, });
        notificationPressureText = text?.value || 'There is no rain. It is recommended to travel.';
    }

    const notificationText = `Current Temperature : ${temp_c} °C\n
Time: ${formatDateThai(new Date(time))}\n
Recommendation:\n
${notificationTemperatureText}
\n
Current Rainfall : ${precip_mm} mm\n
Recommendation:\n
${notificationPressureText}
`

    const users = await prisma.lineUser.findMany();

    const notifications = users.map((user: any) =>
        client.pushMessage(user.userId, { type: 'text', text: notificationText || 'Test Line Notifications' })
    );

    await Promise.all(notifications);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}));