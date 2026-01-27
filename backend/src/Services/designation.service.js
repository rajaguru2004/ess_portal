const { prisma } = require('../Prisma/client');

const createDesignation = async (data) => {
    const { tenantId, name, code } = data;
    const existing = await prisma.designation.findUnique({
        where: { tenantId_code: { tenantId, code } }
    });
    if (existing) throw new Error('Designation code already exists in this tenant');

    return await prisma.designation.create({ data: { ...data, isActive: true } });
};

const getAllDesignations = async (filter = {}) => {
    const where = {};
    if (filter.tenantId) where.tenantId = filter.tenantId;
    return await prisma.designation.findMany({ where, orderBy: { name: 'asc' } });
};

const getDesignationById = async (id) => {
    return await prisma.designation.findUnique({ where: { id } });
};

const updateDesignation = async (id, data) => {
    return await prisma.designation.update({ where: { id }, data });
};

const deleteDesignation = async (id) => {
    return await prisma.designation.delete({ where: { id } });
};

module.exports = { createDesignation, getAllDesignations, getDesignationById, updateDesignation, deleteDesignation };
