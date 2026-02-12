const { prisma } = require('../Prisma/client');

/**
 * User Hierarchy Service
 * Handles manager assignment and hierarchy management
 */

/**
 * Make an employee a manager (HEAD-only operation)
 * @param {string} headId - ID of the head manager performing the action
 * @param {string} employeeId - ID of the employee to make a manager
 */
const makeManager = async (headId, employeeId) => {
    // Get head manager details
    const head = await prisma.user.findUnique({
        where: { id: headId },
        select: {
            id: true,
            isHeadManager: true,
            departmentId: true,
            tenantId: true
        }
    });

    if (!head || !head.isHeadManager) {
        throw new Error('Only head managers can assign manager roles');
    }

    // Get target employee
    const employee = await prisma.user.findUnique({
        where: { id: employeeId },
        select: {
            id: true,
            fullName: true,
            employeeCode: true,
            departmentId: true,
            tenantId: true,
            managerId: true,
            isHeadManager: true
        }
    });

    if (!employee) {
        throw new Error('Employee not found');
    }

    // Validate same tenant and department
    if (employee.tenantId !== head.tenantId) {
        throw new Error('Can only assign managers within same tenant');
    }

    if (employee.departmentId !== head.departmentId) {
        throw new Error('Can only assign managers within same department');
    }

    // Check if already a manager or head manager
    if (employee.isHeadManager) {
        throw new Error('User is already a head manager');
    }

    // Update employee to manager role
    const updatedUser = await prisma.user.update({
        where: { id: employeeId },
        data: {
            managerId: headId,
            isManager: true,
            // Note: isHeadManager stays false for regular managers
        },
        select: {
            id: true,
            employeeCode: true,
            fullName: true,
            email: true,
            isManager: true,
            isHeadManager: true,
            managerId: true,
            manager: {
                select: {
                    id: true,
                    fullName: true,
                    employeeCode: true
                }
            }
        }
    });

    return updatedUser;
};

/**
 * Promote an employee to Head Manager (ADMIN-only operation)
 * @param {string} employeeId - ID of the employee to promote
 */
const makeHeadManager = async (employeeId) => {
    // Get target employee
    const employee = await prisma.user.findUnique({
        where: { id: employeeId },
        select: {
            id: true,
            isHeadManager: true
        }
    });

    if (!employee) {
        throw new Error('Employee not found');
    }

    // Update employee to head manager status
    const updatedUser = await prisma.user.update({
        where: { id: employeeId },
        data: {
            isManager: true,
            isHeadManager: true,
            managerId: null // Head managers typically don't have a direct manager (approval goes to Admin)
        },
        select: {
            id: true,
            employeeCode: true,
            fullName: true,
            isManager: true,
            isHeadManager: true,
            managerId: true
        }
    });

    return updatedUser;
};

/**
 * Check for circular hierarchy
 * Recursively checks if targetManagerId is a subordinate of employeeId
 */
const hasCircularHierarchy = async (employeeId, targetManagerId) => {
    if (employeeId === targetManagerId) {
        return true;
    }

    // Get the target manager
    const manager = await prisma.user.findUnique({
        where: { id: targetManagerId },
        select: { managerId: true }
    });

    if (!manager || !manager.managerId) {
        return false;
    }

    // Recursively check up the hierarchy
    return hasCircularHierarchy(employeeId, manager.managerId);
};

/**
 * Assign an employee to a manager (HEAD-only operation)
 * @param {string} headId - ID of the head manager performing the action
 * @param {string} employeeId - ID of the employee to assign
 * @param {string} managerId - ID of the manager to assign to
 */
const assignEmployeeToManager = async (headId, employeeId, managerId) => {
    // Get head manager details
    const head = await prisma.user.findUnique({
        where: { id: headId },
        select: {
            id: true,
            isHeadManager: true,
            departmentId: true,
            tenantId: true
        }
    });

    if (!head || !head.isHeadManager) {
        throw new Error('Only head managers can assign employees to managers');
    }

    // Get employee
    const employee = await prisma.user.findUnique({
        where: { id: employeeId },
        select: {
            id: true,
            fullName: true,
            employeeCode: true,
            departmentId: true,
            tenantId: true
        }
    });

    if (!employee) {
        throw new Error('Employee not found');
    }

    // Get manager
    const manager = await prisma.user.findUnique({
        where: { id: managerId },
        select: {
            id: true,
            fullName: true,
            employeeCode: true,
            departmentId: true,
            tenantId: true,
            isHeadManager: true
        }
    });

    if (!manager) {
        throw new Error('Manager not found');
    }

    // Validation: Same tenant
    if (employee.tenantId !== head.tenantId || manager.tenantId !== head.tenantId) {
        throw new Error('All users must belong to the same tenant');
    }

    // Validation: Same department
    if (employee.departmentId !== head.departmentId || manager.departmentId !== head.departmentId) {
        throw new Error('All users must belong to the same department');
    }

    // Prevent self-assignment
    if (employeeId === managerId) {
        throw new Error('Employee cannot be assigned to themselves');
    }

    // Prevent circular hierarchy
    const isCircular = await hasCircularHierarchy(employeeId, managerId);
    if (isCircular) {
        throw new Error('Cannot create circular hierarchy: the manager is a subordinate of this employee');
    }

    // Update employee's manager
    const updatedEmployee = await prisma.user.update({
        where: { id: employeeId },
        data: {
            managerId: managerId
        },
        select: {
            id: true,
            employeeCode: true,
            fullName: true,
            email: true,
            managerId: true,
            manager: {
                select: {
                    id: true,
                    fullName: true,
                    employeeCode: true
                }
            }
        }
    });

    return updatedEmployee;
};

/**
 * Get hierarchy tree for a user
 * @param {string} userId - User ID to get hierarchy for
 */
const getHierarchy = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            manager: {
                select: {
                    id: true,
                    fullName: true,
                    employeeCode: true,
                    isHeadManager: true
                }
            },
            subordinates: {
                select: {
                    id: true,
                    fullName: true,
                    employeeCode: true,
                    email: true,
                    designation: true,
                    isHeadManager: true
                }
            }
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

/**
 * Get all managers and their hierarchy
 * Returns all users who are head managers or have at least one subordinate
 */
const getAllManagers = async () => {
    const managers = await prisma.user.findMany({
        where: {
            OR: [
                { isHeadManager: true },
                { isManager: true },
                { subordinates: { some: {} } }
            ]
        },
        select: {
            id: true,
            employeeCode: true,
            fullName: true,
            email: true,
            designation: true,
            isHeadManager: true,
            departmentId: true,
            managerId: true,
            subordinates: {
                select: {
                    id: true,
                    fullName: true,
                    employeeCode: true,
                    designation: true,
                    isHeadManager: true
                }
            },
            manager: {
                select: {
                    id: true,
                    fullName: true,
                    employeeCode: true
                }
            }
        },
        orderBy: {
            fullName: 'asc'
        }
    });

    return managers;
};

module.exports = {
    makeManager,
    makeHeadManager,
    assignEmployeeToManager,
    getHierarchy,
    getAllManagers,
    hasCircularHierarchy
};
