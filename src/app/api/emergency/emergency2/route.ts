export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { withAuthAndAdmin, withAPIHandler } from '@/lib/middleware/apiWithMiddleware';
import { ApiError } from '@/types/api/apiError';
import { EmergencyRecord } from '../function';

const TOPIC = 'emergency2';

export const GET = withAPIHandler(async () => {
    const emergency = await prisma.configuration.findFirst({
        where: { key: TOPIC },
    });
    return Response.json(JSON.parse(emergency?.value || '{}'));
});

export const POST = withAPIHandler(withAuthAndAdmin(async (req) => {
    try {
        const { station, contact, stationOld } = await req.json();

        if (!station || !contact) {
            throw ApiError.badRequest('Missing required fields');
        }

        const emergencys = await prisma.configuration.findFirst({
            where: { key: TOPIC },
        });

        if (emergencys) {
            const new_emergency = JSON.parse(emergencys.value) as EmergencyRecord[];
            if (stationOld) {
                const stationIndex = new_emergency.findIndex((e) => e.station === stationOld);
                if (stationIndex !== -1) {
                    new_emergency[stationIndex] = { station, contact, topic: TOPIC } as EmergencyRecord;
                }
                else {
                    new_emergency.push({ station, contact, topic: TOPIC } as EmergencyRecord);
                }
                await prisma.configuration.update({
                    where: { key: TOPIC },
                    data: { value: JSON.stringify(new_emergency) },
                });
            }
            else {
                const stationIndex = new_emergency.findIndex((e) => e.station === station);
                if (stationIndex !== -1) {
                    new_emergency[stationIndex] = { station, contact, topic: TOPIC } as EmergencyRecord;
                }
                else {
                    new_emergency.push({ station, contact, topic: TOPIC } as EmergencyRecord);
                }
                await prisma.configuration.update({
                    where: { key: TOPIC },
                    data: { value: JSON.stringify(new_emergency) },
                });
            }
        } else {
            await prisma.configuration.create({
                data: { key: TOPIC, value: JSON.stringify([{ station, contact, topic: TOPIC }] as EmergencyRecord[]) },
            });
        }

        return Response.json({ success: true });
    } catch (e: any) {
        throw ApiError.internalServerError(e);
    }
}));

export const DELETE = withAPIHandler(withAuthAndAdmin(async (req) => {
    try {
        const { station } = await req.json();

        if (!station) {
            throw ApiError.badRequest('Missing required fields');
        }

        const emergencys = await prisma.configuration.findFirst({
            where: { key: TOPIC },
        });

        if (emergencys) {
            const new_emergency = JSON.parse(emergencys.value) as EmergencyRecord[];
            const stationIndex = new_emergency.findIndex((e) => e.station === station);
            if (stationIndex !== -1) {
                new_emergency.splice(stationIndex, 1);
                await prisma.configuration.update({
                    where: { key: TOPIC },
                    data: { value: JSON.stringify(new_emergency) },
                });
            }
        }
        else {
            throw ApiError.badRequest('No such station');
        }

        return Response.json({ success: true });
    } catch (e: any) {
        throw ApiError.internalServerError(e);
    }
}));