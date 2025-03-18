"use server";

import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserVerificationStatus } from "@/types/prisma/UserVerificationStatus";
import { PermissionTypes, RoleTypes } from "@/types/prisma/RBACTypes";
import { ROUTES } from "../route";
import { rbacMiddleware } from "./rbacMiddleware";

// Constrain TProps so TypeScript understands we're dealing with an object of props
export async function withAuthServer<TProps extends object>(
    Component: React.ComponentType<TProps>,
) {
    return async function AuthenticatedComponent(props: TProps) {
        const session = await auth();

        if (!session?.user?.email) {
            notFound();
        }

        if (session.user.status !== UserVerificationStatus.VERIFIED) {
            notFound();
        }

        return <Component {...props} />;
    };
}

export async function withAuthAndAdminServer<TProps extends object>(
    Component: React.ComponentType<TProps>
) {
    return async function AuthenticatedAndAdminComponent(props: TProps) {
        const session = await auth();

        // Ensure user is logged in
        if (!session?.user?.email) {
            notFound();
        }

        // Ensure user is verified
        if (session.user.status !== UserVerificationStatus.VERIFIED) {
            notFound();
        }

        // Check if the user is an Admin or Super Admin
        const isSuperAdmin =
            session.user.role === RoleTypes.SuperAdmin ||
            session.user.role === RoleTypes.Admin;

        if (!isSuperAdmin) {
            redirect(ROUTES.UNAUTHORIZED);
        }

        // Render the component if all checks pass
        return <Component {...props} />;
    };
}

export async function withAuthAndRBACServer<T>(
    permissionMap: PermissionTypes[],
    resources: Record<string, any | undefined> = {}
): Promise<T | void> {
    const session = await auth();

    // 2. Redirect or notFound if not authenticated
    if (!session?.user?.email) {
        return redirect(ROUTES.LOGIN);
    }

    // 3. Check if user is verified
    if (session.user.status !== UserVerificationStatus.VERIFIED) {
        return redirect(ROUTES.UNAUTHORIZED);
    }

    // 4. Perform RBAC check
    try {
        await rbacMiddleware(session, permissionMap, resources);
    } catch {
        return redirect(ROUTES.UNAUTHORIZED);
    }

    // 5. Return session if all checks pass
    return session as T;
}