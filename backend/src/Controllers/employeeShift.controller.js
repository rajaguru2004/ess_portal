const EmployeeShiftService = require('../Services/employeeShift.service');
const { successResponse, errorResponse } = require('../Utils/response');

/**
 * Get employee's shift for today
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTodayShift = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from JWT by auth middleware
        const data = await EmployeeShiftService.getTodayShift(userId);
        return successResponse(res, data, 'Today\'s shift fetched successfully');
    } catch (error) {
        console.error('Error fetching today\'s shift:', error);
        return errorResponse(res, 'Failed to fetch shift details', 'SHIFT_001', 500);
    }
};

/**
 * Get employee's upcoming shifts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUpcomingShifts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { from, to } = req.query;

        const data = await EmployeeShiftService.getUpcomingShifts(userId, from, to);
        return successResponse(res, data, 'Upcoming shifts fetched successfully');
    } catch (error) {
        console.error('Error fetching upcoming shifts:', error);
        return errorResponse(res, 'Failed to fetch upcoming shifts', 'SHIFT_002', 500);
    }
};

module.exports = {
    getTodayShift,
    getUpcomingShifts,
};
