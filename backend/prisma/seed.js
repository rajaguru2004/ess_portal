const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/Utils/password');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting comprehensive seed...');

    const validTenantId = '123e4567-e89b-12d3-a456-426614174000';
    const validBranchId = '123e4567-e89b-12d3-a456-426614174001';

    // 1. Roles
    const adminRole = await prisma.role.upsert({
        where: { code: 'ADMIN' },
        update: {},
        create: { name: 'Admin', code: 'ADMIN', description: 'System Administrator', isSystemRole: true }
    });

    const managerRole = await prisma.role.upsert({
        where: { code: 'MANAGER' },
        update: {},
        create: { name: 'Manager', code: 'MANAGER', description: 'Department Manager', isSystemRole: false }
    });

    const employeeRole = await prisma.role.upsert({
        where: { code: 'EMPLOYEE' },
        update: {},
        create: { name: 'Employee', code: 'EMPLOYEE', description: 'Regular Employee', isSystemRole: false }
    });

    console.log('✅ Roles seeded');

    // 2. Departments
    const engineeringDept = await prisma.department.upsert({
        where: { tenantId_code: { tenantId: validTenantId, code: 'ENG' } },
        update: {},
        create: { tenantId: validTenantId, branchId: validBranchId, name: 'Engineering', code: 'ENG' }
    });

    const hrDept = await prisma.department.upsert({
        where: { tenantId_code: { tenantId: validTenantId, code: 'HR' } },
        update: {},
        create: { tenantId: validTenantId, branchId: validBranchId, name: 'Human Resources', code: 'HR' }
    });

    console.log('✅ Departments seeded');

    // 3. Leave Types
    const clType = await prisma.leaveType.upsert({
        where: { tenantId_code: { tenantId: validTenantId, code: 'CL' } },
        update: {},
        create: { tenantId: validTenantId, name: 'Casual Leave', code: 'CL', defaultDays: 12, carryForwardAllowed: true, maxCarryForward: 5 }
    });

    const slType = await prisma.leaveType.upsert({
        where: { tenantId_code: { tenantId: validTenantId, code: 'SL' } },
        update: {},
        create: { tenantId: validTenantId, name: 'Sick Leave', code: 'SL', defaultDays: 10, carryForwardAllowed: false }
    });

    const plType = await prisma.leaveType.upsert({
        where: { tenantId_code: { tenantId: validTenantId, code: 'PL' } },
        update: {},
        create: { tenantId: validTenantId, name: 'Privilege Leave', code: 'PL', defaultDays: 15, carryForwardAllowed: true, encashmentAllowed: true }
    });

    console.log('✅ Leave Types seeded');

    // 4. Role Leave Policies
    const policies = [
        { roleId: employeeRole.id, leaveTypeId: clType.id, annualQuota: 12, accrualType: 'ANNUAL' },
        { roleId: employeeRole.id, leaveTypeId: slType.id, annualQuota: 10, accrualType: 'ANNUAL' },
        { roleId: employeeRole.id, leaveTypeId: plType.id, annualQuota: 15, accrualType: 'ANNUAL' },
        { roleId: managerRole.id, leaveTypeId: clType.id, annualQuota: 15, accrualType: 'ANNUAL' },
        { roleId: managerRole.id, leaveTypeId: slType.id, annualQuota: 12, accrualType: 'ANNUAL' },
        { roleId: managerRole.id, leaveTypeId: plType.id, annualQuota: 18, accrualType: 'ANNUAL' },
    ];

    for (const policy of policies) {
        await prisma.roleLeavePolicy.upsert({
            where: { roleId_leaveTypeId: { roleId: policy.roleId, leaveTypeId: policy.leaveTypeId } },
            update: { annualQuota: policy.annualQuota, accrualType: policy.accrualType },
            create: policy
        });
    }

    console.log('✅ Role Leave Policies seeded');

    // 5. Users
    const commonPassword = await hashPassword('Password123!');

    const adminUser = await prisma.user.upsert({
        where: { username: 'admin' },
        update: { roleId: adminRole.id, tenantId: validTenantId, branchId: validBranchId, departmentId: engineeringDept.id },
        create: {
            employeeCode: 'ADM001', username: 'admin', fullName: 'System Admin', email: 'admin@ess.com',
            passwordHash: commonPassword, roleId: adminRole.id, tenantId: validTenantId, branchId: validBranchId,
            departmentId: engineeringDept.id, isActive: true
        }
    });

    const managerUser = await prisma.user.upsert({
        where: { username: 'manager1' },
        update: { roleId: managerRole.id, tenantId: validTenantId, branchId: validBranchId, departmentId: engineeringDept.id },
        create: {
            employeeCode: 'MGR001', username: 'manager1', fullName: 'Engineering Manager', email: 'manager@ess.com',
            passwordHash: commonPassword, roleId: managerRole.id, tenantId: validTenantId, branchId: validBranchId,
            departmentId: engineeringDept.id, isActive: true
        }
    });

    const employee1 = await prisma.user.upsert({
        where: { username: 'emp101' },
        update: { roleId: employeeRole.id, tenantId: validTenantId, branchId: validBranchId, departmentId: engineeringDept.id, managerId: managerUser.id },
        create: {
            employeeCode: 'EMP101', username: 'emp101', fullName: 'Ravi Kumar', email: 'ravi@ess.com',
            passwordHash: commonPassword, roleId: employeeRole.id, tenantId: validTenantId, branchId: validBranchId,
            departmentId: engineeringDept.id, managerId: managerUser.id, isActive: true
        }
    });

    const employee2 = await prisma.user.upsert({
        where: { username: 'emp102' },
        update: { roleId: employeeRole.id, tenantId: validTenantId, branchId: validBranchId, departmentId: engineeringDept.id, managerId: managerUser.id },
        create: {
            employeeCode: 'EMP102', username: 'emp102', fullName: 'Anita Singh', email: 'anita@ess.com',
            passwordHash: commonPassword, roleId: employeeRole.id, tenantId: validTenantId, branchId: validBranchId,
            departmentId: engineeringDept.id, managerId: managerUser.id, isActive: true
        }
    });

    // Generate 30 Test Employees for Hierarchy Testing
    const testUsers = [];
    for (let i = 1; i <= 30; i++) {
        const empNum = i.toString().padStart(2, '0'); // 01, 02, ... 30
        const user = await prisma.user.upsert({
            where: { username: `user${empNum}` },
            update: {
                roleId: employeeRole.id,
                tenantId: validTenantId,
                branchId: validBranchId,
                departmentId: engineeringDept.id
            },
            create: {
                employeeCode: `TEST${empNum}`,
                username: `user${empNum}`,
                fullName: `Test User ${empNum}`,
                email: `user${empNum}@test.com`,
                passwordHash: commonPassword,
                roleId: employeeRole.id,
                tenantId: validTenantId,
                branchId: validBranchId,
                departmentId: engineeringDept.id,
                isActive: true
            }
        });
        testUsers.push(user);
    }
    console.log('✅ 30 Test Employees seeded');

    console.log('✅ Users seeded');

    // 6. Leave Balances (2026)
    const currentYear = 2026;
    const users = [managerUser, employee1, employee2, ...testUsers];
    const leaveTypes = [clType, slType, plType];

    for (const user of users) {
        for (const type of leaveTypes) {
            const policy = policies.find(p => p.roleId === user.roleId && p.leaveTypeId === type.id);
            await prisma.leaveBalance.upsert({
                where: { userId_leaveTypeId_year: { userId: user.id, leaveTypeId: type.id, year: currentYear } },
                update: { allocated: policy.annualQuota },
                create: {
                    userId: user.id, leaveTypeId: type.id, year: currentYear,
                    allocated: policy.annualQuota, used: 0, carryForward: 0
                }
            });
        }
    }

    console.log('✅ Leave Balances seeded');

    // 7. Holidays
    const holidays = [
        { name: 'New Year', date: new Date('2026-01-01'), type: 'ORGANIZATION' },
        { name: 'Republic Day', date: new Date('2026-01-26'), type: 'ORGANIZATION' },
        { name: 'Independence Day', date: new Date('2026-08-15'), type: 'ORGANIZATION' },
    ];

    for (const h of holidays) {
        await prisma.holiday.create({
            data: { ...h, tenantId: validTenantId, branchId: validBranchId }
        });
    }

    console.log('✅ Holidays seeded');

    // 8. Sample Leave Applications
    // Employee 1: PENDING (future)
    await prisma.leaveApplication.create({
        data: {
            userId: employee1.id, leaveTypeId: clType.id, startDate: new Date('2026-03-10'), endDate: new Date('2026-03-12'),
            totalDays: 3, reason: 'Family trip', year: currentYear, status: 'PENDING'
        }
    });

    // Employee 2: APPROVED (historical/ongoing for count test)
    const approvedLeave = await prisma.leaveApplication.create({
        data: {
            userId: employee2.id, leaveTypeId: slType.id, startDate: new Date('2026-02-01'), endDate: new Date('2026-02-02'),
            totalDays: 2, reason: 'Medical', year: currentYear, status: 'APPROVED',
            approvedBy: managerUser.id, approvedAt: new Date()
        }
    });

    // Update balance for approved leave
    await prisma.leaveBalance.update({
        where: { userId_leaveTypeId_year: { userId: employee2.id, leaveTypeId: slType.id, year: currentYear } },
        data: { used: { increment: 2 } }
    });

    // Create attendance for approved leave
    await prisma.attendance.createMany({
        data: [
            { userId: employee2.id, date: new Date('2026-02-01'), status: 'ON_LEAVE', leaveApplicationId: approvedLeave.id },
            { userId: employee2.id, date: new Date('2026-02-02'), status: 'ON_LEAVE', leaveApplicationId: approvedLeave.id }
        ]
    });

    console.log('✅ Sample Leave Applications seeded');
    console.log('🚀 Seed process completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
