const { prisma } = require('../Prisma/client');

const createHoliday = async (data) => {
    const { tenantId, branchId, name, date, type } = data;
    // Optional check: duplicate holiday on same date?
    const existing = await prisma.holiday.findFirst({
        where: {
            tenantId,
            date: new Date(date), // ensure date comparison works
            branchId: branchId || null // handle null branchId specifically
        }
    });

    // Not strictly enforcing unique here based on schema, but usually good practice.
    // Schema doesn't have unique constraint.

    return await prisma.holiday.create({
        data: {
            tenantId,
            branchId,
            name,
            date,
            type
        }
    });
};

const getAllHolidays = async (filter = {}) => {
    const where = {};
    if (filter.tenantId) where.tenantId = filter.tenantId;
    return await prisma.holiday.findMany({ where, orderBy: { date: 'asc' } });
};

const getHolidayById = async (id) => {
    return await prisma.holiday.findUnique({ where: { id } });
};

const updateHoliday = async (id, data) => {
    return await prisma.holiday.update({ where: { id }, data });
};

const deleteHoliday = async (id) => {
    return await prisma.holiday.delete({ where: { id } });
};

module.exports = { createHoliday, getAllHolidays, getHolidayById, updateHoliday, deleteHoliday };
