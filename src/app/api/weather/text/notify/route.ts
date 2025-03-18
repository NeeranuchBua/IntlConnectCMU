export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { withAuthAndAdmin, withAPIHandler } from '@/lib/middleware/apiWithMiddleware';
import { ApiError } from '@/types/api/apiError';
import { Client } from '@line/bot-sdk';

const client = new Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'ChannelAccessToken',
});

export const POST = withAPIHandler(withAuthAndAdmin(async (req) => {
    const { weatherConfig } = await req.json();

    if (!weatherConfig) {
        throw ApiError.badRequest('Missing required fields.');
    }

    const weatherConfiguration = ['weathertexthot', 'weathertextcold', 'weathertextrainlow', 'weathertextrainhigh'];

    if (weatherConfiguration.indexOf(weatherConfig) === -1) {
        throw ApiError.badRequest('Invalid AQI configuration.');
    }

    const notificationText = await prisma.configuration.findFirst({
        where: { key: weatherConfig },
    });

    const users = await prisma.lineUser.findMany();

    const notifications = users.map((user: any) =>
        client.pushMessage(user.userId, { type: 'text', text: notificationText?.value || 'Test CMUWS Line Weather Notifications' })
    );

    await Promise.all(notifications);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}));