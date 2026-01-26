const userService = require('../Services/user.service');
const { successResponse, errorResponse } = require('../Utils/response');
const { prisma } = require('../Prisma/client'); // Import prisma to check role

/**
 * Create User Controller
 */
const createUser = async (req, res, next) => {
    try {
        // 1. Check if requester has Admin role
        const requesterRoleId = req.user.roleId; // Extracted from token by auth middleware

        const role = await prisma.role.findUnique({
            where: { id: requesterRoleId },
        });

        // Check if role exists and is Admin (assuming 'Admin' name or specific code)
        // Adjust logic based on your Role seeding. For now, checking name 'Admin' is common.
        // Or we can check based on a 'code' field if defined in schema. Schema has 'code'.
        if (!role || (role.name !== 'Admin' && role.code !== 'ADMIN')) {
            return errorResponse(res, 'Access denied: Admin role required', 'AUTH_FORBIDDEN', 403);
        }

        const createdBy = req.user.userId;

        // 2. Call service
        const userData = req.body;
        const result = await userService.createUser(userData, createdBy);

        return successResponse(res, result, 'User created successfully', 201);

    } catch (error) {
        // Handle specific service errors
        if (error.message.includes('already exists')) {
            return errorResponse(res, error.message, 'USER_DUPLICATE', 409);
        }
        if (error.message.includes('does not exist')) {
            return errorResponse(res, error.message, 'USER_INVALID_REF', 400);
        }
        next(error);
    }
};

module.exports = {
    createUser,
};
