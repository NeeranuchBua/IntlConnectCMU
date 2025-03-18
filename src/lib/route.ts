// lib/routes.ts
type ProjectId = string | number;

function convertProjectId(projectId: ProjectId): string {
    return typeof projectId === `number` ? projectId.toString() : projectId;
}

export const ROUTES_PATH = {
    DASHBOARD: `/dashboard`,
    PROJECTS: `/projects`,
    DISPLAY: `/display`,
    HISTORY: `/history`,
    ADMIN: `/admin`,
    TEMPLATES: `/templates`,
}

export const ROUTES = {
    LOGIN: `/login`,
    UNAUTHORIZED: `/unauthorized`,
    DASHBOARD: '/dashboard',
    DISPLAY: '/display',
    HISTORY: `/history`,
    PROJECTS: ROUTES_PATH.PROJECTS,
    PROJECT: (projectId: ProjectId) => `${ROUTES_PATH.PROJECTS}/${convertProjectId(projectId)}`,
    PROJECT_RESOURCE: (projectId: ProjectId, resourceId: string) => `${ROUTES_PATH.PROJECTS}/project/${convertProjectId(projectId)}/resources/${resourceId}`,
    ADMIN_DASHBOARD: `${ROUTES_PATH.ADMIN}`,
    ADMIN_ACCESS_CONTROL: `${ROUTES_PATH.ADMIN}/access-control`,

    TEMPLATES: ROUTES_PATH.TEMPLATES,
};