const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/Utils/password');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Admin Role
    const adminRole = await prisma.role.upsert({
        where: { code: 'ADMIN' },
        update: {},
        create: {
            name: 'Admin',
            code: 'ADMIN',
            description: 'System Administrator',
            isSystemRole: true,
        },
    });

    console.log(`Created Role: ${adminRole.name}`);

    // 2. Create Tenant (Dummy)
    const tenantId = 'default-tenant-id'; // using a fixed UUID-like string or just a string if UUID validation permits
    // Wait, Joi validates UUID. So I should use a real UUID.
    // But Prisma schema says tenantId is String. It doesn't enforce UUID in DB, but Joi does.
    // Let's use a valid UUID.
    const validTenantId = '123e4567-e89b-12d3-a456-426614174000';
    const validBranchId = '123e4567-e89b-12d3-a456-426614174001';
    const validDeptId = '123e4567-e89b-12d3-a456-426614174002';

    // 3. Create Admin User
    const adminPassword = 'AdminPassword123!';
    const hashedPassword = await hashPassword(adminPassword);

    const adminUser = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            passwordHash: hashedPassword, // Ensure password is set
            roleId: adminRole.id
        },
        create: {
            employeeCode: 'ADMIN001',
            username: 'admin',
            fullName: 'System Admin',
            email: 'admin@ess.com',
            passwordHash: hashedPassword,
            roleId: adminRole.id,
            tenantId: validTenantId,
            branchId: validBranchId,
            departmentId: validDeptId,
            isActive: true,
            firstLogin: true,
        },
    });

    console.log(`Created User: ${adminUser.username} (Password: ${adminPassword})`);

    console.log('✅ Seed completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
