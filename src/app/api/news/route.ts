// /api/posts POST
import { withAuthAndAdmin, withAPIHandler } from "@/lib/middleware/apiWithMiddleware";
import prisma from "@/lib/prisma";
import { ApiError } from "@/types/api/apiError";

export const GET = withAPIHandler(withAuthAndAdmin(async () => {
    const posts = await prisma.post.findMany();
    return new Response(JSON.stringify(posts), { status: 200 });
}));

export const POST = withAPIHandler(withAuthAndAdmin(async (req) => {
    const { title, description, imageUrl } = await req.json();

    if (!title || !description) {
        throw ApiError.badRequest('Title and description are required');
    }

    const post = await prisma.post.create({
        data: { title, description, imageUrl },
    });

    return new Response(JSON.stringify(post), { status: 201 });
}));