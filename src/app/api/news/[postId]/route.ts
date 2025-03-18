// /api/posts/[id] PUT
import { withAuthAndAdmin, withAPIHandler } from "@/lib/middleware/apiWithMiddleware";
import prisma from "@/lib/prisma";
import { getParam } from "@/lib/utils";

export const PUT = withAPIHandler(withAuthAndAdmin(async (req,context) => {
    const postId = getParam(context, 'postId', true);
    const { title, description, imageUrl } = await req.json();

    if (!postId || !title || !description) {
        throw new Error("Missing required fields.");
    }

    const post = await prisma.post.update({
        where: { id: String(postId) },
        data: { title, description, imageUrl },
    });

    return new Response(JSON.stringify(post), { status: 200 });
}));

// /api/posts/[id] DELETE
export const DELETE = withAPIHandler(withAuthAndAdmin(async (req,context) => {
    const postId = getParam(context, 'postId', true);

    if (!postId) {
        throw new Error("Missing required fields.");
    }

    await prisma.post.delete({
        where: { id: String(postId) },
    });

    return new Response(null, { status: 204 });
}));