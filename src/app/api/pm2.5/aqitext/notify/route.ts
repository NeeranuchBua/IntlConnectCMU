export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { withAuthAndAdmin, withAPIHandler } from '@/lib/middleware/apiWithMiddleware';
import { ApiError } from '@/types/api/apiError';
import { Client } from '@line/bot-sdk';

const client = new Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'ChannelAccessToken',
});

export const POST = withAPIHandler(withAuthAndAdmin(async (req) => {
    const { aqiConfig } = await req.json();

    if (!aqiConfig) {
        throw ApiError.badRequest('Missing required fields.');
    }

    const aqiConfiguration = ['aqi0', 'aqi25', 'aqi50', 'aqi100', 'aqi200'];

    if (aqiConfiguration.indexOf(aqiConfig) === -1) {
        throw ApiError.badRequest('Invalid AQI configuration.');
    }

    const notificationText = await prisma.configuration.findFirst({
        where: { key: aqiConfig },
    });

    const users = await prisma.lineUser.findMany();

    const notifications = users.map((user: any) =>
        client.pushMessage(user.userId, { type: 'text', text: notificationText?.value || 'Test Line Notifications' })
    );

    await Promise.all(notifications);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}));