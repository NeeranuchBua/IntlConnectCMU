import { getEmergencyConfigs } from "../function";

export const dynamic = 'force-dynamic';

export const GET = async () => {
    const config = await getEmergencyConfigs();
    return Response.json(config);
}