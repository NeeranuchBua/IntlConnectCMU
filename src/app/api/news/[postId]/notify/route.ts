export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { withAuthAndAdmin, withAPIHandler } from '@/lib/middleware/apiWithMiddleware';
import { ApiError } from '@/types/api/apiError';
import { Client } from '@line/bot-sdk';
import { getParam } from '@/lib/utils';

const client = new Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'ChannelAccessToken',
});

export const POST = withAPIHandler(withAuthAndAdmin(async (_, context) => {
    const postId = getParam(context, 'postId', true);

    if (!postId) {
        throw ApiError.badRequest('Missing required fields.');
    }

    // Fetch the post data from the database
    const post = await prisma.post.findUnique({
        where: { id: String(postId) },
    });

    if (!post) {
        throw ApiError.notFound('Post not found.');
    }

    const { title, description, imageUrl } = post;

    if (!title || !description) {
        throw ApiError.badRequest('Post is missing title or description.');
    }

    // Create a message object based on whether the post includes an image
    const messages = [] as any[];
    messages.push({
        type: 'text',
        text: `Title: ${title}\n\nDescription: ${description}`,
    });

    if (imageUrl) {
        messages.push({
            type: 'image',
            originalContentUrl: imageUrl,
            previewImageUrl: imageUrl,
        });
    }

    // Fetch all LINE users
    const users = await prisma.lineUser.findMany();

    // Send notifications to all users
    const notifications = users.map((user: any) =>
        client.pushMessage(user.userId, messages)
    );

    // Wait for all notifications to be sent
    await Promise.all(notifications);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}));