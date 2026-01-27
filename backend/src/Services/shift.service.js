const { prisma } = require('../Prisma/client');

const createShift = async (data) => {
    const { tenantId, name, code, startTime, endTime } = data;

    const existing = await prisma.shift.findUnique({
        where: { tenantId_code: { tenantId, code } }
    });

    if (existing) {
        throw new Error('Shift code already exists in this tenant');
    }

    return await prisma.shift.create({
        data: {
            ...data,
            isActive: true
        }
    });
};

const getAllShifts = async (filter = {}) => {
    const where = {};
    if (filter.tenantId) where.tenantId = filter.tenantId;
    return await prisma.shift.findMany({ where, orderBy: { name: 'asc' } });
};

const getShiftById = async (id) => {
    return await prisma.shift.findUnique({ where: { id } });
};

const updateShift = async (id, data) => {
    return await prisma.shift.update({ where: { id }, data });
};

const deleteShift = async (id) => {
    return await prisma.shift.delete({ where: { id } });
};

module.exports = {
    createShift,
    getAllShifts,
    getShiftById,
    updateShift,
    deleteShift
};
