const { prisma } = require('../Prisma/client');
const { hashPassword } = require('../Utils/password');

/**
 * Create User Service
 * Handles user creation logic
 */
const createUser = async (userData, createdBy) => {
    const {
        employeeCode,
        username,
        password,
        fullName,
        email,
        mobile,
        tenantId,
        branchId,
        departmentId,
        roleId,
        managerId,
    } = userData;

    // 1. Check uniqueness for employeeCode (Prisma will also throw, but we can check early)
    const existingCode = await prisma.user.findUnique({
        where: { employeeCode },
    });
    if (existingCode) {
        throw new Error('Employee code already exists');
    }

    // 2. Check uniqueness for username
    const existingUsername = await prisma.user.findUnique({
        where: { username },
    });
    if (existingUsername) {
        throw new Error('Username already exists');
    }

    // 3. Verify Role exists
    const role = await prisma.role.findUnique({
        where: { id: roleId },
    });
    if (!role) {
        throw new Error('Provided Role ID does not exist');
    }

    // 4. Verify Manager exists (if provided)
    if (managerId && managerId !== '') {
        const manager = await prisma.user.findUnique({
            where: { id: managerId },
        });
        if (!manager) {
            throw new Error('Provided Manager ID does not exist');
        }
    }

    // 5. Hash password
    const passwordHash = await hashPassword(password);

    // 6. Create User
    const newUser = await prisma.user.create({
        data: {
            employeeCode,
            username,
            passwordHash,
            fullName,
            email,
            mobile,
            tenantId,
            branchId,
            departmentId,
            roleId,
            managerId: (managerId && managerId !== '') ? managerId : null,
            isActive: true,
            firstLogin: true,
            failedLoginAttempts: 0,
            createdBy,
        },
    });

    // 5. Return sanitized user data
    return {
        id: newUser.id,
        employeeCode: newUser.employeeCode,
        username: newUser.username,
        fullName: newUser.fullName,
        firstLogin: newUser.firstLogin,
    };
};

/**
 * Get All Users Service
 * Retrieves a list of all users
 */
const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            employeeCode: true,
            username: true,
            fullName: true,
            email: true,
            mobile: true,
            tenantId: true,
            branchId: true,
            departmentId: true,
            roleId: true,
            managerId: true,
            isManager: true,
            isHeadManager: true,
            isActive: true,
            createdAt: true,
            Role: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    description: true
                }
            },
            manager: {
                select: {
                    id: true,
                    fullName: true,
                    employeeCode: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return users;
};

module.exports = {
    createUser,
    getAllUsers,
};
