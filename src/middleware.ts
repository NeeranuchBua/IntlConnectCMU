// middleware.ts

import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { UserVerificationStatus } from "./types/prisma/UserVerificationStatus";
import axios from "axios";

// 1) Import jose for signing
import { SignJWT } from "jose";

// NextAuth usage
const { auth } = NextAuth(authConfig);

// We still have our normal secret for sessions:
const sessionSecret = process.env.AUTH_SECRET;

// But we also have a *separate* secret for logging
const loggingSecret = "your-secret-here";

export default auth(async (req) => {
    let token = await getToken({
        req,
        secret: sessionSecret,
        cookieName: "__Secure-authjs.session-token",
    });

    if (token === null) {
        token = await getToken({
            req,
            secret: sessionSecret,
            cookieName: "authjs.session-token",
        });
    }

    // 2) Generate a short-lived JWT to authenticate the log request
    let ephemeralLoggingToken = "";
    try {
        // A short-living token (e.g., 1 minute)
        ephemeralLoggingToken = await new SignJWT({
            // optional: store minimal info in payload
            iat: Math.floor(Date.now() / 1000),
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30s")
            .sign(new TextEncoder().encode(loggingSecret));
    } catch (error) {
        console.error("Failed generating ephemeral logging token:", error);
    }

    // 3) Perform the logging request as before, but with ephemeral token
    if (req.nextUrl.pathname !== "/api/log" && process.env.ALLOW_LOGGING === "true") {
        const xForwardedFor = req.headers.get("x-forwarded-for");
        let realIp = "unknown";

        if (xForwardedFor) {
            // If multiple IPs, pick the first one
            realIp = xForwardedFor.split(",")[0].trim();
        } else if (req.ip) {
            // fallback to req.ip
            realIp = req.ip;
        }
        const logData = {
            userEmail: token?.email || null,
            method: req.method,
            path: `${req.nextUrl.pathname}${req.nextUrl.search}`,
            ip: realIp,
            type: "requestlog",
            userRole: null,
        } as any;

        if (token?.role && token?.email) {
            logData.type = "accesslog";
            logData.userRole = token.role || null;
        }
        axios
            .post(
                `${process.env.NODE_ENV === "development"
                    ? process.env.NEXT_URL
                    : "http://visops:3000"
                }/api/log`,
                logData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        // 4) Send ephemeral token in the header
                        "x-logging-auth": ephemeralLoggingToken,
                    },
                }
            )
            .catch((error) => {
                console.error("Error logging request:", error);
            });
    }

    // ... (Below remains your NextAuth logic & redirection rules) ...

    if (token) {
        const now = Math.floor(Date.now() / 1000);
        if (token?.exp && token.exp < now) {
            const newUrl = new URL("/api/auth/signout", req.nextUrl.origin);
            return NextResponse.redirect(newUrl);
        }
    }
    if (!req.auth && req.nextUrl.pathname !== "/login") {
        const newUrl = new URL("/login", req.nextUrl.origin);
        if (req.nextUrl.pathname !== "/") {
            newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        }
        return NextResponse.redirect(newUrl);
    }
    if (token === null && req.nextUrl.pathname !== "/login") {
        const newUrl = new URL("/login", req.nextUrl.origin);
        if (req.nextUrl.pathname !== "/") {
            newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        }
        return NextResponse.redirect(newUrl);
    } else if (
        token &&
        token.status &&
        token.status !== UserVerificationStatus.VERIFIED &&
        req.nextUrl.pathname !== "/accessdenied"
    ) {
        const newUrl = new URL("/accessdenied", req.nextUrl.origin);
        return NextResponse.redirect(newUrl);
    } else if (
        token &&
        token.status &&
        token.status === UserVerificationStatus.INVALID &&
        req.nextUrl.pathname !== "/api/auth/signout"
    ) {
        const newUrl = new URL("/api/auth/signout", req.nextUrl.origin);
        return NextResponse.redirect(newUrl);
    }

    const headers = new Headers(req.headers);
    headers.set("x-current-path", req.nextUrl.pathname);

    return NextResponse.next({ headers });
});

export const config = {
    matcher: [
        "/((?!api/auth|api/webhook|history|dashboard/emergency_call|api/log|api/emergency/public|_next/static|_next/image|favicon.ico|static|manifest.webmanifest|apple-touch-icon.png).*)",
    ],
};