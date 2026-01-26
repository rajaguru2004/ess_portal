const roleService = require('../Services/role.service');
const { successResponse, errorResponse } = require('../Utils/response');
const { prisma } = require('../Prisma/client');

/**
 * Create Role Controller
 */
const createRole = async (req, res, next) => {
    try {
        // Admin check
        const requesterRoleId = req.user.roleId;
        const requesterRole = await prisma.role.findUnique({ where: { id: requesterRoleId } });

        if (!requesterRole || (requesterRole.name !== 'Admin' && requesterRole.code !== 'ADMIN')) {
            return errorResponse(res, 'Access denied: Admin role required', 'AUTH_FORBIDDEN', 403);
        }

        const role = await roleService.createRole(req.body);
        return successResponse(res, role, 'Role created successfully', 201);
    } catch (error) {
        if (error.message === 'Role code already exists') {
            return errorResponse(res, error.message, 'ROLE_DUPLICATE', 409);
        }
        next(error);
    }
};

/**
 * Get All Roles Controller
 */
const getAllRoles = async (req, res, next) => {
    try {
        const roles = await roleService.getAllRoles();
        return successResponse(res, roles, 'Roles fetched successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRole,
    getAllRoles
};
