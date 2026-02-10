const leaveApprovalService = require('../Services/leaveApproval.service');
const { successResponse, errorResponse } = require('../Utils/response');

/**
 * Leave Approval Controller
 * Handles manager approval and rejection workflow
 */

/**
 * Get pending approvals for manager
 */
const getPendingApprovals = async (req, res, next) => {
    try {
        const managerId = req.user.userId;
        const { leaveTypeId, year } = req.query;

        const pendingLeaves = await leaveApprovalService.getPendingApprovals(managerId, {
            leaveTypeId,
            year
        });

        return successResponse(res, pendingLeaves, 'Pending approvals retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Approve leave
 */
const approveLeave = async (req, res, next) => {
    try {
        const managerId = req.user.userId;
        const { id } = req.params;

        const approvedLeave = await leaveApprovalService.approveLeave(id, managerId);

        return successResponse(res, approvedLeave, 'Leave approved successfully');
    } catch (error) {
        // Handle approval errors
        if (error.message.includes('not found') ||
            error.message.includes('department') ||
            error.message.includes('status') ||
            error.message.includes('balance')) {
            return errorResponse(res, error.message, 'LEAVE_APPROVAL_ERROR', 400);
        }
        next(error);
    }
};

/**
 * Reject leave
 */
const rejectLeave = async (req, res, next) => {
    try {
        const managerId = req.user.userId;
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return errorResponse(res, 'Rejection reason is required', 'VALIDATION_ERROR', 400);
        }

        const rejectedLeave = await leaveApprovalService.rejectLeave(id, managerId, reason);

        return successResponse(res, rejectedLeave, 'Leave rejected successfully');
    } catch (error) {
        // Handle rejection errors
        if (error.message.includes('not found') ||
            error.message.includes('department') ||
            error.message.includes('status')) {
            return errorResponse(res, error.message, 'LEAVE_REJECTION_ERROR', 400);
        }
        next(error);
    }
};

/**
 * Get team leave calendar
 */
const getTeamCalendar = async (req, res, next) => {
    try {
        const managerId = req.user.userId;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return errorResponse(res, 'Start date and end date are required', 'VALIDATION_ERROR', 400);
        }

        const teamLeaves = await leaveApprovalService.getTeamCalendar(
            managerId,
            new Date(startDate),
            new Date(endDate)
        );

        return successResponse(res, teamLeaves, 'Team calendar retrieved successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPendingApprovals,
    approveLeave,
    rejectLeave,
    getTeamCalendar
};
