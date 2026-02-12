const { errorResponse } = require('../Utils/response');
const { prisma } = require('../Prisma/client');

/**
 * Require Head Manager Authorization
 * Validates that the authenticated user has isHeadManager = true
 */
const requireHeadManager = async (req, res, next) => {
    try {
        if (!req.user) {
            return errorResponse(res, 'User not authenticated', 'AUTH_010', 401);
        }

        const userId = req.user.userId;

        // Query user to check isHeadManager flag
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isHeadManager: true }
        });

        if (!user) {
            return errorResponse(res, 'User not found', 'AUTH_011', 404);
        }

        if (!user.isHeadManager) {
            return errorResponse(
                res,
                'Only Head Managers can perform this action',
                'AUTH_012',
                403
            );
        }

        next();
    } catch (error) {
        console.error('Head Manager Authorization Error:', error);
        return errorResponse(res, 'Internal Server Error', 'AUTH_013', 500);
    }
};

module.exports = { requireHeadManager };
