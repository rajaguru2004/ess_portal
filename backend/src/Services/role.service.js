const { prisma } = require('../Prisma/client');

/**
 * Create Role Service
 */
const createRole = async (roleData) => {
    const { name, code, description, isSystemRole } = roleData;

    // 1. Check if code already exists
    const existingRole = await prisma.role.findUnique({
        where: { code },
    });
    if (existingRole) {
        throw new Error('Role code already exists');
    }

    // 2. Create Role
    const newRole = await prisma.role.create({
        data: {
            name,
            code,
            description,
            isSystemRole: isSystemRole || false
        }
    });

    return newRole;
};

/**
 * Get All Roles Service
 */
const getAllRoles = async () => {
    return await prisma.role.findMany({
        orderBy: { name: 'asc' }
    });
};

module.exports = {
    createRole,
    getAllRoles
};
