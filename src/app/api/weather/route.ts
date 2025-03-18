export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { withAuthAndAdmin, withAPIHandler } from '@/lib/middleware/apiWithMiddleware';
import { ApiError } from '@/types/api/apiError';

export const GET = withAPIHandler(withAuthAndAdmin(async () => {
    try {
        const configs = {} as Record<string,string>;
        const weatherconfig6 = await prisma.configuration.findFirst({
            where: { key: 'weatherconfig6' },
        });
        configs.weatherconfig6 = weatherconfig6?.value || '0';

        return Response.json(Object.entries(configs).map(([key, value]) => ({ key, value })).reduce((acc, { key, value }) => {
            acc[key] = value === '1';
            return acc;
        }
        , {} as Record<string,boolean>));
    } catch (e: any) {
        console.error('Unexpected error:', e);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}));

export const POST = withAPIHandler(withAuthAndAdmin(async (req) => {
    try {
        const { weatherconfig6 } = await req.json();

        if(weatherconfig6 === undefined) {
            throw ApiError.badRequest('Missing required fields.');
        }

        await prisma.configuration.upsert({
            where: { key: 'weatherconfig6' },
            update: { value: weatherconfig6 ? '1' : '0' },
            create: { key: 'weatherconfig6', value: weatherconfig6 ? '1' : '0' },
        });

        return Response.json({ success: true });
    } catch (e: any) {
        throw ApiError.internalServerError(e);
    }
}));