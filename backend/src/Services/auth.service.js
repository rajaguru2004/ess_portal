const { prisma } = require('../Prisma/client');
const { comparePassword, hashPassword } = require('../Utils/password');
const { generateAccessToken } = require('../Utils/jwt');

/**
 * Login Service
 * Handles user authentication logic
 */
const login = async (username, password, clientIp) => {
    // 1. Fetch user by username
    const user = await prisma.user.findUnique({
        where: { username },
        include: { Role: true }, // Include Role to check permissions if needed
    });

    // 2. User not found
    if (!user) {
        throw new Error('Invalid credentials'); // Generic message for security
    }

    // 3. Check if account is active
    if (!user.isActive) {
        throw new Error('Account disabled');
    }

    // 4. Check if account is locked
    if (user.isLocked) {
        throw new Error('Account locked');
    }

    // 5. Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
        // Increment failed login attempts
        const newFailedAttempts = user.failedLoginAttempts + 1;
        let updateData = { failedLoginAttempts: newFailedAttempts };

        // Lock account if attempts >= 5
        if (newFailedAttempts >= 5) {
            updateData.isLocked = true;
        }

        // Update user record
        await prisma.user.update({
            where: { id: user.id },
            data: updateData,
        });

        if (updateData.isLocked) {
            throw new Error('Account locked due to multiple failed attempts');
        }

        throw new Error('Invalid credentials');
    }

    // 6. Login Success

    // Reset failed attempts and update login info
    await prisma.user.update({
        where: { id: user.id },
        data: {
            failedLoginAttempts: 0,
            lastLoginAt: new Date(),
            lastLoginIp: clientIp,
        },
    });

    console.log('Login Service - Fetched User Role:', user.Role);

    // Generate Token
    const tokenPayload = {
        userId: user.id,
        roleId: user.roleId,
        roleCode: user.Role ? user.Role.code : (user.role ? user.role.code : 'UNKNOWN'), // Attempt both casings
        tenantId: user.tenantId,
        employeeCode: user.employeeCode,
        username: user.username,
    };

    console.log('Login Service - Token Payload:', tokenPayload);

    const accessToken = generateAccessToken(tokenPayload);

    // Return data (exclude sensitive info)
    return {
        accessToken,
        user: {
            id: user.id,
            employeeCode: user.employeeCode,
            username: user.username,
            fullName: user.fullName,
            roleId: user.roleId,
            tenantId: user.tenantId,
            isManager: user.isManager,
            isHeadManager: user.isHeadManager,
            firstLogin: user.firstLogin,
        },
    };
};



/**
 * Change Password Service
 */
const changePassword = async (userId, newPassword) => {
    // 1. Find User
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // 2. Hash New Password
    const passwordHash = await hashPassword(newPassword);

    // 3. Update User
    await prisma.user.update({
        where: { id: userId },
        data: {
            passwordHash: passwordHash,
            firstLogin: false,
            failedLoginAttempts: 0,
            isLocked: false // Unlock if they were locked (optional, but good for self-service recovery if we allow it)
        }
    });

    return true;
};

module.exports = {
    login,
    changePassword
};
