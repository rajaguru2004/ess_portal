const leaveService = require('../Services/leave.service');
const { successResponse, errorResponse } = require('../Utils/response');

/**
 * Leave Controller
 * Handles leave application, balance queries, and cancellation
 */

/**
 * Apply for leave
 */
const applyLeave = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { leaveTypeId, startDate, endDate, halfDayType, reason } = req.body;

        const leaveApplication = await leaveService.applyLeave(userId, {
            leaveTypeId,
            startDate,
            endDate,
            halfDayType,
            reason
        });

        return successResponse(res, leaveApplication, 'Leave application submitted successfully', 201);
    } catch (error) {
        // Handle validation errors
        if (error.message.includes('Insufficient') ||
            error.message.includes('overlapping') ||
            error.message.includes('past') ||
            error.message.includes('attendance') ||
            error.message.includes('year')) {
            return errorResponse(res, error.message, 'LEAVE_VALIDATION_ERROR', 400);
        }
        next(error);
    }
};

/**
 * Get my leaves
 */
const getMyLeaves = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { status, year, leaveTypeId } = req.query;

        const leaves = await leaveService.getMyLeaves(userId, {
            status,
            year,
            leaveTypeId
        });

        return successResponse(res, leaves, 'Leaves retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get leave balance
 */
const getLeaveBalance = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

        const balances = await leaveService.getAllBalances(userId, year);

        return successResponse(res, balances, 'Leave balance retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel leave
 */
const cancelLeave = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const cancelledLeave = await leaveService.cancelLeave(id, userId);

        return successResponse(res, cancelledLeave, 'Leave cancelled successfully');
    } catch (error) {
        // Handle cancellation errors
        if (error.message.includes('not found') ||
            error.message.includes('only cancel your own') ||
            error.message.includes('already') ||
            error.message.includes('Cannot cancel')) {
            return errorResponse(res, error.message, 'LEAVE_CANCELLATION_ERROR', 400);
        }
        next(error);
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getLeaveBalance,
    cancelLeave
};
