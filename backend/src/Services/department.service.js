const { prisma } = require('../Prisma/client');

/**
 * Create Department Service
 */
const createDepartment = async (data) => {
    const { tenantId, branchId, name, code, managerId } = data;

    // Check if code exists within the same tenant
    const existingDept = await prisma.department.findUnique({
        where: {
            tenantId_code: {
                tenantId,
                code
            }
        }
    });

    if (existingDept) {
        throw new Error('Department code already exists in this tenant');
    }

    const department = await prisma.department.create({
        data: {
            tenantId,
            branchId,
            name,
            code,
            managerId,
            isActive: true
        }
    });

    return department;
};

/**
 * Get All Departments (optionally filter by tenant)
 */
const getAllDepartments = async (filter = {}) => {
    const where = {};
    if (filter.tenantId) where.tenantId = filter.tenantId;

    return await prisma.department.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
            // Include manager info if needed, strict minimal for now
        }
    });
};

/**
 * Get Department by ID
 */
const getDepartmentById = async (id) => {
    return await prisma.department.findUnique({
        where: { id }
    });
};

/**
 * Update Department
 */
const updateDepartment = async (id, data) => {
    return await prisma.department.update({
        where: { id },
        data
    });
};

/**
 * Delete Department
 */
const deleteDepartment = async (id) => {
    return await prisma.department.delete({
        where: { id }
    });
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};
