export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { withAuthAndAdmin, withAPIHandler } from '@/lib/middleware/apiWithMiddleware';
import { ApiError } from '@/types/api/apiError';
import { notificationService } from '@/lib/function/NotificationService';

notificationService.getInstance();

export const GET = withAPIHandler(withAuthAndAdmin(async () => {
    try {
        const configs = {} as Record<string,string>;
        const pm25config6 = await prisma.configuration.findFirst({
            where: { key: 'pm25config6' },
        });
        const pm25config12 = await prisma.configuration.findFirst({
            where: { key: 'pm25config12' },
        });
        const pm25config18 = await prisma.configuration.findFirst({
            where: { key: 'pm25config18' },
        });
        const aqi100image = await prisma.configuration.findFirst({
            where: { key: 'aqi100image' },
        });
        configs.pm25config6 = pm25config6?.value || '0';
        configs.pm25config12 = pm25config12?.value || '0';
        configs.pm25config18 = pm25config18?.value || '0';
        configs.aqi100image = aqi100image?.value || '0';

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
        const { pm25config6, pm25config12, pm25config18, aqi100image } = await req.json();

        if(pm25config6 === undefined || pm25config12 === undefined || pm25config18 === undefined || aqi100image === undefined) {
            throw ApiError.badRequest('Missing required fields.');
        }

        await prisma.configuration.upsert({
            where: { key: 'pm25config6' },
            update: { value: pm25config6 ? '1' : '0' },
            create: { key: 'pm25config6', value: pm25config6 ? '1' : '0' },
        });

        await prisma.configuration.upsert({
            where: { key: 'pm25config12' },
            update: { value: pm25config12 ? '1' : '0' },
            create: { key: 'pm25config12', value: pm25config12 ? '1' : '0' },
        });

        await prisma.configuration.upsert({
            where: { key: 'pm25config18' },
            update: { value: pm25config18 ? '1' : '0' },
            create: { key: 'pm25config18', value: pm25config18 ? '1' : '0' },
        });

        await prisma.configuration.upsert({
            where: { key: 'aqi100image' },
            update: { value: aqi100image ? '1' : '0' },
            create: { key: 'aqi100image', value: aqi100image ? '1' : '0' },
        });

        return Response.json({ success: true });
    } catch (e: any) {
        throw ApiError.internalServerError(e);
    }
}));