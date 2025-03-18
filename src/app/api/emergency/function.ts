import prisma from "@/lib/prisma";

export interface EmergencyRecord {
    topic: string;
    station: string;
    contact: string;
}

export interface EmergencyConfig {
    emergency1: EmergencyRecord[] | null;
    emergency2: EmergencyRecord[] | null;
    emergency3: EmergencyRecord[] | null;
}

export async function getEmergencyConfigs(): Promise<EmergencyConfig> {
    const emergency1 = await prisma.configuration.findFirst({
        where: { key: 'emergency1' },
    });
    const emergency2 = await prisma.configuration.findFirst({
        where: { key: 'emergency2' },
    });
    const emergency3 = await prisma.configuration.findFirst({
        where: { key: 'emergency3' },
    });

    return {
        emergency1: emergency1 ? JSON.parse(emergency1.value) : null,
        emergency2: emergency2 ? JSON.parse(emergency2.value) : null,
        emergency3: emergency3 ? JSON.parse(emergency3.value) : null,
    } as EmergencyConfig;
}