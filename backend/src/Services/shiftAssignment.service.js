const { prisma } = require('../Prisma/client');

/**
 * Create a new shift assignment request
 * @param {Object} data - Assignment data (userId, shiftId, date)
 * @param {string} requestedBy - User ID who requested the assignment
 * @returns {Promise<Object>} Created shift assignment
 */
const createShiftAssignment = async (data, requestedBy) => {
    const { userId, shiftId, date } = data;

    // Check if shift assignment already exists for this user and date
    // Check if shift assignment already exists for this user, date, and SPECIFIC shift
    const existing = await prisma.shiftAssignment.findFirst({
        where: {
            userId,
            shiftId,
            date: new Date(date),
        },
    });

    if (existing) {
        throw new Error('This specific shift is already assigned for this user on this date');
    }

    // Create the shift assignment with PENDING status
    return await prisma.shiftAssignment.create({
        data: {
            userId,
            shiftId,
            date: new Date(date),
            status: 'PENDING',
            requestedBy,
        },
    });
};

/**
 * Get shift assignments with optional filters
 * @param {Object} filters - Filter options (status, date, userId)
 * @returns {Promise<Array>} List of shift assignments
 */
const getShiftAssignments = async (filters = {}) => {
    const where = {};

    if (filters.status) {
        where.status = filters.status;
    }

    if (filters.date) {
        where.date = new Date(filters.date);
    }

    if (filters.userId) {
        where.userId = filters.userId;
    }

    return await prisma.shiftAssignment.findMany({
        where,
        orderBy: [
            { date: 'desc' },
            { createdAt: 'desc' },
        ],
    });
};

/**
 * Approve a shift assignment
 * @param {string} id - Assignment ID
 * @param {string} approvedBy - Admin user ID
 * @returns {Promise<Object>} Updated shift assignment
 */
const approveShiftAssignment = async (id, approvedBy) => {
    // Get the assignment
    const assignment = await prisma.shiftAssignment.findUnique({
        where: { id },
    });

    if (!assignment) {
        throw new Error('Shift assignment not found');
    }

    // Check if status is PENDING
    if (assignment.status !== 'PENDING') {
        throw new Error('Only pending shift assignments can be approved');
    }

    // Update status to APPROVED
    return await prisma.shiftAssignment.update({
        where: { id },
        data: {
            status: 'APPROVED',
            approvedBy,
            approvedAt: new Date(),
        },
    });
};

/**
 * Reject a shift assignment
 * @param {string} id - Assignment ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Updated shift assignment
 */
const rejectShiftAssignment = async (id, reason) => {
    // Get the assignment
    const assignment = await prisma.shiftAssignment.findUnique({
        where: { id },
    });

    if (!assignment) {
        throw new Error('Shift assignment not found');
    }

    // Check if status is PENDING
    if (assignment.status !== 'PENDING') {
        throw new Error('Only pending shift assignments can be rejected');
    }

    // Update status to REJECTED
    return await prisma.shiftAssignment.update({
        where: { id },
        data: {
            status: 'REJECTED',
            rejectionReason: reason,
        },
    });
};

/**
 * Remove a shift assignment
 * @param {string} id - Assignment ID
 * @returns {Promise<void>}
 */
const removeShiftAssignment = async (id) => {
    // Get the assignment
    const assignment = await prisma.shiftAssignment.findUnique({
        where: { id },
    });

    if (!assignment) {
        throw new Error('Shift assignment not found');
    }

    // Check if status is APPROVED
    if (assignment.status !== 'APPROVED') {
        throw new Error('Only approved shift assignments can be removed');
    }

    // Check if date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const assignmentDate = new Date(assignment.date);
    assignmentDate.setHours(0, 0, 0, 0);

    if (assignmentDate <= today) {
        throw new Error('Cannot remove shift assignments for past or current dates');
    }

    // Delete the assignment
    await prisma.shiftAssignment.delete({
        where: { id },
    });
};

module.exports = {
    createShiftAssignment,
    getShiftAssignments,
    approveShiftAssignment,
    rejectShiftAssignment,
    removeShiftAssignment,
};
