const { prisma } = require('../Prisma/client');

const createLeaveType = async (data) => {
    const { tenantId, code } = data;
    const existing = await prisma.leaveType.findUnique({
        where: { tenantId_code: { tenantId, code } }
    });
    if (existing) throw new Error('LeaveType code already exists in this tenant');

    return await prisma.leaveType.create({ data: { ...data, isActive: true } });
};

const getAllLeaveTypes = async (filter = {}) => {
    const where = {};
    if (filter.tenantId) where.tenantId = filter.tenantId;
    return await prisma.leaveType.findMany({ where, orderBy: { name: 'asc' } });
};

const getLeaveTypeById = async (id) => {
    return await prisma.leaveType.findUnique({ where: { id } });
};

const updateLeaveType = async (id, data) => {
    return await prisma.leaveType.update({ where: { id }, data });
};

const deleteLeaveType = async (id) => {
    return await prisma.leaveType.delete({ where: { id } });
};

module.exports = { createLeaveType, getAllLeaveTypes, getLeaveTypeById, updateLeaveType, deleteLeaveType };
