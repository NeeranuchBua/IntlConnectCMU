export enum PermissionTypes {
    //Admin Permission
    AdminUserManagement = 'ADMIN_USER_MANAGEMENT',  // Manage users
    ConfigPM25 = 'CONFIG_PM25',  // Config PM2.5
}
export enum RoleTypes {
    SuperAdmin = 'SUPER_ADMIN',
    Admin = 'ADMIN',
    User = 'USER',
}

export const rolePermissionsMapping: { [key in RoleTypes]?: PermissionTypes[] } = {
    [RoleTypes.SuperAdmin]: [
        PermissionTypes.AdminUserManagement,
        PermissionTypes.ConfigPM25,
    ],
    [RoleTypes.Admin]: [
        PermissionTypes.AdminUserManagement,
        PermissionTypes.ConfigPM25,
    ],
};

export const roleLevels: Record<string, number> = {
    [RoleTypes.SuperAdmin]: 1,
    [RoleTypes.Admin]: 2,
    [RoleTypes.User]: 3,
};