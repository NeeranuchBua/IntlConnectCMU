// /api/log/route.ts (or log.ts, depending on your Next.js structure)

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { RoleTypes } from "@/types/prisma/RBACTypes";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
    // 1) Retrieve ephemeral token
    const ephemeralLoggingToken = req.headers.get("x-logging-auth");
    if (!ephemeralLoggingToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Verify ephemeral JWT
    try {
        await jwtVerify(
            ephemeralLoggingToken,
            new TextEncoder().encode("your-secret-here")
        );

        // Optionally, you can check `payload.iat`, `payload.exp`, or any custom claims
    } catch (error) {
        console.error("Error verifying logging token:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3) If verified, proceed to parse body & insert logs
    try {
        const { userEmail, method, path, ip, type, userRole } = await req.json();

        if (type === "accesslog") {
            await prisma.accessLog.create({
                data: {
                    userEmail,
                    method,
                    path,
                    ip,
                    userRole: userRole || RoleTypes.User,
                },
            });
        } else {
            await prisma.requestLog.create({
                data: {
                    userEmail,
                    method,
                    path,
                    ip,
                },
            });
        }

        return NextResponse.json({ message: "Log saved" }, { status: 200 });
    } catch (error) {
        console.error("Log error:", error);
        return NextResponse.json({ error: "Failed to log request" }, { status: 500 });
    }
}