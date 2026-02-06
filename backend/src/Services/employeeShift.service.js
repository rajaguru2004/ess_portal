const { prisma } = require('../Prisma/client');
const { format } = require('date-fns');

/**
 * Get approved shifts for today
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Formatted shifts data
 */
const getTodayShift = async (userId) => {
    // 1. Get server date (YYYY-MM-DD)
    const today = format(new Date(), 'yyyy-MM-dd');

    // 2. Query ShiftAssignments
    const assignments = await prisma.shiftAssignment.findMany({
        where: {
            userId: userId,
            date: new Date(today), // Prisma needs Date object for DateTime fields
            status: 'APPROVED',
        },
    });

    if (assignments.length === 0) {
        return {
            date: today,
            shifts: [],
        };
    }

    // 3. Fetch Shift details manually
    const shiftIds = [...new Set(assignments.map(a => a.shiftId))];
    const shifts = await prisma.shift.findMany({
        where: { id: { in: shiftIds } },
    });

    const shiftMap = shifts.reduce((acc, shift) => {
        acc[shift.id] = shift;
        return acc;
    }, {});

    // 4. Format response
    return {
        date: today,
        shifts: assignments.map(assignment => {
            const shift = shiftMap[assignment.shiftId];
            return shift ? {
                id: shift.id,
                name: shift.name,
                type: shift.type || 'DAY',
                startTime: shift.startTime,
                endTime: shift.endTime,
            } : null;
        }).filter(shift => shift !== null),
    };
};

/**
 * Get upcoming approved shifts
 * @param {string} userId - User ID
 * @param {string} from - Start date (YYYY-MM-DD)
 * @param {string} to - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} List of formatted shifts
 */
const getUpcomingShifts = async (userId, from, to) => {
    // Defaults
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);

    const startDate = from ? new Date(from) : tomorrow;
    const endDate = to ? new Date(to) : next30Days;

    // 2. Query ShiftAssignments
    const assignments = await prisma.shiftAssignment.findMany({
        where: {
            userId: userId,
            status: 'APPROVED',
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: {
            date: 'asc',
        },
    });

    if (assignments.length === 0) {
        return [];
    }

    // 3. Fetch all related shifts
    const shiftIds = [...new Set(assignments.map(a => a.shiftId))];
    const shifts = await prisma.shift.findMany({
        where: {
            id: { in: shiftIds },
        },
    });

    // Map shifts by ID for easy lookup
    const shiftMap = shifts.reduce((acc, shift) => {
        acc[shift.id] = shift;
        return acc;
    }, {});

    // 4. Format response
    return assignments.map(assignment => {
        const shift = shiftMap[assignment.shiftId];
        return {
            date: format(assignment.date, 'yyyy-MM-dd'),
            shift: shift ? {
                id: shift.id,
                name: shift.name,
                type: shift.type || 'DAY',
                startTime: shift.startTime,
                endTime: shift.endTime,
            } : null,
        };
    });
};

module.exports = {
    getTodayShift,
    getUpcomingShifts,
};
