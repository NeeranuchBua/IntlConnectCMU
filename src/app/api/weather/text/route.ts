export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { withAuthAndAdmin, withAPIHandler } from '@/lib/middleware/apiWithMiddleware';
import { ApiError } from '@/types/api/apiError';

export const GET = withAPIHandler(withAuthAndAdmin(async () => {
    try {
        const configs = {} as Record<string, string>;
        const weathertexthot = await prisma.configuration.findFirst({
            where: { key: 'weathertexthot' },
        });
        const weathertextcold = await prisma.configuration.findFirst({
            where: { key: 'weathertextcold' },
        });
        const weathertextrainlow = await prisma.configuration.findFirst({
            where: { key: 'weathertextrainlow' },
        });
        const weathertextrainhigh = await prisma.configuration.findFirst({
            where: { key: 'weathertextrainhigh' },
        });
        configs.weathertexthot = weathertexthot?.value || '';
        configs.weathertextcold = weathertextcold?.value || '';
        configs.weathertextrainlow = weathertextrainlow?.value || '';
        configs.weathertextrainhigh = weathertextrainhigh?.value || '';

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
    const { weatherConfig, weatherText } = await req.json();

    if (!weatherConfig || !weatherText) {
        throw ApiError.badRequest('Missing required fields.');
    }

    const weatherConfiguration = ['weathertexthot', 'weathertextcold', 'weathertextrainlow', 'weathertextrainhigh'];

    if (weatherConfiguration.indexOf(weatherConfig) === -1) {
        throw ApiError.badRequest('Invalid Weather configuration.');
    }

    await prisma.configuration.upsert({
        where: { key: weatherConfig },
        update: { value: weatherText },
        create: { key: weatherConfig, value: weatherText },
    });

    return Response.json({ success: true });
}));