const { prisma } = require('../Prisma/client');

const createRoleLeavePolicy = async (data) => {
    const { roleId, leaveTypeId, annualQuota, accrualType } = data;

    const existing = await prisma.roleLeavePolicy.findUnique({
        where: { roleId_leaveTypeId: { roleId, leaveTypeId } }
    });

    if (existing) {
        throw new Error('Policy for this Role and Leave Type already exists');
    }

    return await prisma.roleLeavePolicy.create({
        data: {
            roleId,
            leaveTypeId,
            annualQuota,
            accrualType,
            isActive: true
        }
    });
};

const getAllPolicies = async () => {
    return await prisma.roleLeavePolicy.findMany({
        include: {
            // Optional: include role and leave type details
        }
    });
};

const getPolicyById = async (id) => {
    return await prisma.roleLeavePolicy.findUnique({ where: { id } });
};

const updatePolicy = async (id, data) => {
    return await prisma.roleLeavePolicy.update({ where: { id }, data });
};

const deletePolicy = async (id) => {
    return await prisma.roleLeavePolicy.delete({ where: { id } });
};

module.exports = { createRoleLeavePolicy, getAllPolicies, getPolicyById, updatePolicy, deletePolicy };
