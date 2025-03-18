import { PrismaClient } from '@prisma/client';
import { PermissionTypes, rolePermissionsMapping, RoleTypes } from '@/types/prisma/RBACTypes';

// ANSI colors for better readability
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

import { execSync as execType } from 'child_process';

// Initialize execSync to null
let execSync: typeof execType | null = null;

async function loadChildProcess() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { execSync: exec } = await import('child_process');
        execSync = exec;
    }
}

// Check if console.clear exists, then clear the screen to remove the Next.js watermark
if (typeof console.clear === 'function') {
    console.clear();
}

// Set up the database
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
});

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        try {
            console.log(`${colors.cyan}🚀 Welcome to the App Startup! Let's get everything set up...${colors.reset}`);
            console.log(`${colors.yellow}🔧 App is starting up...${colors.reset}`);
            // Display the current process
            console.log(`${colors.blue}🔍 Checking for system dependencies...${colors.reset}`);

            await loadChildProcess();

            if (execSync) {
                console.log(`${colors.green}✅ Dependencies are loaded successfully!${colors.reset}`);
                console.log(`${colors.blue}🔄 Applying Prisma migrations...${colors.reset}`);
                execSync('npx prisma migrate deploy', { stdio: 'inherit' });
                console.log(`${colors.green}✅ Prisma migrations applied successfully!${colors.reset}`);
            }

            console.log(`${colors.blue}🌐 Checking database connectivity...${colors.reset}`);
            await prisma.$connect();
            console.log(`${colors.green}✅ Database connected successfully!${colors.reset}`);

            // Seed data
            await seedPermissions();
            await seedRoles();
            await seedRolePermissions();

            // Check for admin user
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
            const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'changeme';
            const superAdminRole = await prisma.role.findUnique({
                where: { name: RoleTypes.SuperAdmin },
            });

            if (!superAdminRole) throw new Error('SuperAdmin role not found! Ensure roles are seeded before creating the default admin.');

            const adminUserCount = await prisma.user.count({
                where: { role: { id: superAdminRole.id } },
            });

            if (adminUserCount === 0) {
                console.log(`${colors.yellow}⚠️ No super-admin users found. Creating a default super-admin user...${colors.reset}`);
                const bcrypt = await import('bcryptjs');
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(defaultAdminPassword, saltRounds);

                await prisma.user.upsert({
                    where: { email: adminEmail },
                    update: { name: 'admin', status: 'VERIFIED', requireChangePassword: true, role: { connect: { id: superAdminRole.id } } },
                    create: { name: 'admin', email: adminEmail, password: hashedPassword, status: 'VERIFIED', requireChangePassword: true, role: { connect: { id: superAdminRole.id } } },
                });

                console.log(`${colors.green}✅ Default admin user created successfully!${colors.reset}`);
            }

            await prisma.$disconnect();
            console.log(`${colors.green}🎉 App startup completed successfully!${colors.reset}`);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.error(`${colors.red}❌ Error during startup: ${errorMessage}${colors.reset}`);
            process.exit(1);
        }
    }
}

// Function to seed permissions
async function seedPermissions() {
    const permissionValues = Object.values(PermissionTypes);
    console.log(`${colors.blue}🔧 Seeding permissions...${colors.reset}`);

    for (const permission of permissionValues) {
        const existingPermission = await prisma.permission.findUnique({
            where: { name: permission },
        });

        if (existingPermission) {
            console.log(`${colors.yellow}⚠️ Permission '${permission}' already exists, skipping.${colors.reset}`);
        } else {
            await prisma.permission.create({
                data: { name: permission },
            });
            console.log(`${colors.green}✅ Added permission '${permission}' to the database.${colors.reset}`);
        }
    }

    console.log(`${colors.green}✅ Permissions seeding completed.${colors.reset}`);
}

// Function to seed roles
async function seedRoles() {
    const roleValues = Object.values(RoleTypes);
    console.log(`${colors.blue}🔧 Seeding roles...${colors.reset}`);

    for (const role of roleValues) {
        const existingRole = await prisma.role.findUnique({
            where: { name: role },
        });

        if (existingRole) {
            console.log(`${colors.yellow}⚠️ Role '${role}' already exists, skipping.${colors.reset}`);
        } else {
            await prisma.role.create({
                data: { name: role },
            });
            console.log(`${colors.green}✅ Added role '${role}' to the database.${colors.reset}`);
        }
    }

    console.log(`${colors.green}✅ Roles seeding completed.${colors.reset}`);
}

// Function to seed role-permission mappings
async function seedRolePermissions() {
    console.log(`${colors.blue}🔧 Seeding role-permission mappings...${colors.reset}`);

    for (const roleName of Object.keys(rolePermissionsMapping) as RoleTypes[]) {
        const role = await prisma.role.findUnique({
            where: { name: roleName },
        });

        if (!role) {
            console.error(`${colors.red}❌ Role '${roleName}' not found! Skipping...${colors.reset}`);
            continue;
        }

        const permissions = rolePermissionsMapping[roleName] || [];
        console.log(`${colors.blue}🔄 Processing role '${roleName}'...${colors.reset}`);

        for (const permissionName of permissions) {
            const permission = await prisma.permission.findUnique({
                where: { name: permissionName },
            });

            if (!permission) {
                console.error(`${colors.red}❌ Permission '${permissionName}' not found! Skipping...${colors.reset}`);
                continue;
            }

            const existingRolePermission = await prisma.rolePermission.findUnique({
                where: {
                    roleId_permissionId: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                },
            });

            if (existingRolePermission) {
                console.log(`${colors.yellow}⚠️ Role '${roleName}' already has permission '${permissionName}', skipping.${colors.reset}`);
            } else {
                await prisma.rolePermission.create({
                    data: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                });
                console.log(`${colors.green}✅ Added permission '${permissionName}' to role '${roleName}'.${colors.reset}`);
            }
        }
    }

    console.log(`${colors.green}✅ Role-permission mappings seeding completed.${colors.reset}`);
}