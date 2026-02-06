const { prisma } = require('../Prisma/client');
const { addDays, format, differenceInDays } = require('date-fns');

/**
 * Create a new shift assignment request
 * @param {Object} data - Assignment data (userId, shiftId, date)
 * @param {string} requestedBy - User ID who requested the assignment
 * @returns {Promise<Object>} Created shift assignment
 */
/**
 * Create new shift assignment request(s)
 * @param {Object} data - Assignment data (userId, shiftId, startDate, endDate)
 * @param {string} requestedBy - User ID who requested the assignment
 * @returns {Promise<Object>} Created shift assignments summary
 */
const createShiftAssignment = async (data, requestedBy) => {
    const { userId, shiftId, startDate, endDate } = data;

    // Ensure dates are Date objects
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    const results = {
        created: [],
        failed: [],
    };

    // Calculate number of days (sanity check to prevent infinite loops or huge ranges)
    const diff = differenceInDays(end, currentDate);
    if (diff < 0) {
        throw new Error('End date cannot be before start date');
    }
    if (diff > 365) {
        throw new Error('Cannot assign shift for more than 1 year at a time');
    }

    // Loop through each day
    while (currentDate <= end) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');

        try {
            // Check specific duplicate
            const existing = await prisma.shiftAssignment.findFirst({
                where: {
                    userId,
                    shiftId,
                    date: new Date(dateStr),
                },
            });

            if (existing) {
                results.failed.push({ date: dateStr, reason: 'Already assigned' });
            } else {
                const created = await prisma.shiftAssignment.create({
                    data: {
                        userId,
                        shiftId,
                        date: new Date(dateStr),
                        status: 'APPROVED', // Auto-approve as per prompt implying admin action, or stick to PENDING?
                        // The previous code set it to PENDING. However, for "shift allocation API is done", usually admin does it directly.
                        // But let's check the previous code... it set PENDING.
                        // The prompt says "admin can create".
                        // I'll keep it as PENDING for now unless user asked otherwise, but usually Admin actions are auto-approved.
                        // Actually, looking at the previous controller logic, there was an approve endpoint.
                        // BUT, if this is the "Admin Panel" creating it, typically it's APPROVED.
                        // Let's stick to PENDING to be safe/consistent with previous logic, OR check if user role matters.
                        // Re-reading logic: "Create a new shift assignment request".
                        // I will stick to PENDING to avoid breaking workflow assumptions, but generally admin creates = Approved.
                        // Let's look at the "business rules" from prompt 1: "Only APPROVED shifts are visible".
                        // User said "admin can create the multiple shifts". Admin creation usually implies direct assignment.
                        // I'll set it to PENDING to match previous logic for now.
                        status: 'PENDING',
                        requestedBy,
                    },
                });
                results.created.push(created);
            }
        } catch (error) {
            results.failed.push({ date: dateStr, reason: error.message });
        }

        currentDate = addDays(currentDate, 1);
    }

    return results;
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
