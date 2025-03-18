export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { Client } from '@line/bot-sdk';

// LINE Bot configuration
const lineConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'ChannelAccessToken',
    channelSecret: process.env.LINE_CHANNEL_SECRET || 'ChannelSecret',
};

// LINE SDK Client
const client = new Client(lineConfig);

// Handle incoming LINE Webhook events
export const POST = async (req: Request) => {
    try { 
        const body = await req.json();

        if (!body.events || body.events.length === 0) {
            return new Response('No events', { status: 200 });
        }

        const events = body.events;

        console.log('Received LINE Webhook events:', events);

        for (const event of events) {
            if (event.type === 'message') {
                const userId = event.source.userId;

                // Save the user ID to the database
                if (userId) {
                    await prisma.lineUser.upsert({
                        where: { userId },
                        update: {},
                        create: { userId },
                    });

                    // Reply to the user
                    await client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: `Hello! 🙏🏼Thank you🙏🏼 for using IntlConnect @CMU !`,
                    });
                }
            }
        }

        return new Response('Success', { status: 200 });
    } catch (e: any) {
        console.error('Error handling LINE Webhook:', e);
        return new Response('Internal Server Error', { status: 500 });
    }
};
