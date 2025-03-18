export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { withAuthAndAdmin, withAPIHandler } from '@/lib/middleware/apiWithMiddleware';
import { ApiError } from '@/types/api/apiError';

export const GET = withAPIHandler(withAuthAndAdmin(async () => {
    try {
        const configs = {} as Record<string, string>;
        const aqi0 = await prisma.configuration.findFirst({
            where: { key: 'aqi0' },
        });
        const aqi25 = await prisma.configuration.findFirst({
            where: { key: 'aqi25' },
        });
        const aqi50 = await prisma.configuration.findFirst({
            where: { key: 'aqi50' },
        });
        const aqi100 = await prisma.configuration.findFirst({
            where: { key: 'aqi100' },
        });
        const aqi200 = await prisma.configuration.findFirst({
            where: { key: 'aqi200' },
        });
        configs.aqi0 = aqi0?.value || '';
        configs.aqi25 = aqi25?.value || '';
        configs.aqi50 = aqi50?.value || '';
        configs.aqi100 = aqi100?.value || '';
        configs.aqi200 = aqi200?.value || '';

        return Response.json(Object.entries(configs).map(([key, value]) => ({ key, value })).reduce((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }
            , {} as Record<string, string>));
    } catch (e: any) {
        console.error('Unexpected error:', e);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}));

export const POST = withAPIHandler(withAuthAndAdmin(async (req) => {
    const { aqiConfig, aqitext } = await req.json();

    if (!aqiConfig || !aqitext) {
        throw ApiError.badRequest('Missing required fields.');
    }

    const aqiConfiguration = ['aqi0', 'aqi25', 'aqi50', 'aqi100', 'aqi200'];

    if (aqiConfiguration.indexOf(aqiConfig) === -1) {
        throw ApiError.badRequest('Invalid AQI configuration.');
    }

    await prisma.configuration.upsert({
        where: { key: aqiConfig },
        update: { value: aqitext },
        create: { key: aqiConfig, value: aqitext },
    });

    return Response.json({ success: true });
}));