import { adminMiddleware, authMiddleware, rbacMiddleware, superAdminMiddleware } from "./rbacMiddleware";
import { ApiError } from "@/types/api/apiError";
import { PermissionTypes } from "@/types/prisma/RBACTypes";
import { Prisma } from "@prisma/client";

export const withAPIHandler = (
    handler: (req: Request, context?: any) => Promise<Response>
) => {
    return async (req: Request, context?: any) => {
        try {
            return await authMiddleware(async () => {
                const response = await handler(req, context);

                // Only wrap JSON responses; pass non-JSON responses directly
                const isJsonResponse = response.headers.get("Content-Type")?.includes("application/json");
                if (isJsonResponse) {
                    return Response.json(await response.json(), { status: response.status });
                }

                return response;
            });
        } catch (e) {
            if (e instanceof ApiError) {
                return Response.json({ error: e.message }, { status: e.statusCode });
            } else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                // Custom error for Prisma unique constraint violation
                const fields = (e.meta?.target as string[] || []).join(', ');
                const errorMessage = `ไม่สามารถบันทึกข้อมูลได้ เนื่องจากข้อมูลในฟิลด์ ${fields} มีอยู่แล้วในระบบ`;
                return Response.json({ error: errorMessage }, { status: 400 });
            }
            else {
                console.error('Unexpected error:', e);
                return Response.json({ error: 'Internal Server Error' }, { status: 500 });
            }
        }
    };
};

export const withAuth = (
    handler: (req: Request, context?: any) => Promise<Response>
) => {
    return async (req: Request, context?: any) => {
        return await authMiddleware(handler, req, context);
    };
};

export const withAuthAndAdmin = (
    handler: (req: Request, context?: any) => Promise<Response>
) => {
    return async (req: Request, context?: any) => {
        return await authMiddleware(
            (req, context) => adminMiddleware(() => handler(req, context)),
            req,
            context
        );
    };
};

export const withAuthAndSuperAdmin = (
    handler: (req: Request, context?: any) => Promise<Response>
) => {
    return async (req: Request, context?: any) => {
        return await authMiddleware(
            (req, context) => superAdminMiddleware(() => handler(req, context)),
            req,
            context
        );
    };
};

export const withAuthAndRBAC = (
    handler: (req: Request, context?: any) => Promise<Response>,
    permissionMap: PermissionTypes[],
    resources: Record<string, any | undefined> = {}
) => {
    return async (req: Request, context: any = {}) => {
        try {
            // Run authMiddleware first with req and context
            return await authMiddleware(
                async (req, ctx) => {
                    // Session is already attached to context by authMiddleware
                    const session = ctx.session;

                    // Check if session exists and user is authenticated
                    if (!session || !session.user || !session.user.email) {
                        throw ApiError.unauthorized('Unauthorized: User not found');
                    }

                    // Determine required permissions
                    const permissions = permissionMap;

                    // Run RBAC middleware
                    await rbacMiddleware(session, permissions, resources);

                    // If RBAC passes, proceed to handler
                    return await handler(req, ctx);
                },
                req,
                context
            );
        } catch (e) {
            if (e instanceof ApiError) {
                return new Response(
                    JSON.stringify({ error: e.message }),
                    { status: e.statusCode, headers: { "Content-Type": "application/json" } }
                );
            }

            // Unexpected errors
            console.error('Unexpected error:', e);
            return new Response(
                JSON.stringify({ error: e instanceof Error ? e.message : 'Internal Server Error' }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    };
};
