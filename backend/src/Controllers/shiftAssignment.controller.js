const shiftAssignmentService = require('../Services/shiftAssignment.service');
const { successResponse, errorResponse } = require('../Utils/response');

/**
 * Create a new shift assignment request
 */
const createShiftAssignment = async (req, res, next) => {
    try {
        const requestedBy = req.user.userId;
        const assignment = await shiftAssignmentService.createShiftAssignment(req.body, requestedBy);
        successResponse(res, assignment, 'Shift assignment request created successfully', 201);
    } catch (error) {
        if (error.message.includes('already assigned')) {
            return errorResponse(res, error.message, 'DUPLICATE_ASSIGNMENT', 409);
        }
        next(error);
    }
};

/**
 * Get shift assignments with optional filters
 */
const getShiftAssignments = async (req, res, next) => {
    try {
        // Admin authorization check
        if (req.user.roleCode !== 'ADMIN') {
            return errorResponse(res, 'Access denied. Admin privileges required.', 'FORBIDDEN', 403);
        }

        const assignments = await shiftAssignmentService.getShiftAssignments(req.query);
        successResponse(res, assignments, 'Shift assignments fetched successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Approve a shift assignment
 */
const approveShiftAssignment = async (req, res, next) => {
    try {
        // Admin authorization check
        if (req.user.roleCode !== 'ADMIN') {
            return errorResponse(res, 'Access denied. Admin privileges required.', 'FORBIDDEN', 403);
        }

        const approvedBy = req.user.userId;
        const assignment = await shiftAssignmentService.approveShiftAssignment(req.params.id, approvedBy);
        successResponse(res, assignment, 'Shift assignment approved successfully');
    } catch (error) {
        if (error.message.includes('not found')) {
            return errorResponse(res, error.message, 'NOT_FOUND', 404);
        }
        if (error.message.includes('Only pending')) {
            return errorResponse(res, error.message, 'INVALID_STATE', 400);
        }
        next(error);
    }
};

/**
 * Reject a shift assignment
 */
const rejectShiftAssignment = async (req, res, next) => {
    try {
        // Admin authorization check
        if (req.user.roleCode !== 'ADMIN') {
            return errorResponse(res, 'Access denied. Admin privileges required.', 'FORBIDDEN', 403);
        }

        const { reason } = req.body;
        const assignment = await shiftAssignmentService.rejectShiftAssignment(req.params.id, reason);
        successResponse(res, assignment, 'Shift assignment rejected successfully');
    } catch (error) {
        if (error.message.includes('not found')) {
            return errorResponse(res, error.message, 'NOT_FOUND', 404);
        }
        if (error.message.includes('Only pending')) {
            return errorResponse(res, error.message, 'INVALID_STATE', 400);
        }
        next(error);
    }
};

/**
 * Remove a shift assignment
 */
const removeShiftAssignment = async (req, res, next) => {
    try {
        // Admin authorization check
        if (req.user.roleCode !== 'ADMIN') {
            return errorResponse(res, 'Access denied. Admin privileges required.', 'FORBIDDEN', 403);
        }

        await shiftAssignmentService.removeShiftAssignment(req.params.id);
        successResponse(res, null, 'Shift assignment removed successfully');
    } catch (error) {
        if (error.message.includes('not found')) {
            return errorResponse(res, error.message, 'NOT_FOUND', 404);
        }
        if (error.message.includes('Only approved')) {
            return errorResponse(res, error.message, 'INVALID_STATE', 400);
        }
        if (error.message.includes('Cannot remove')) {
            return errorResponse(res, error.message, 'INVALID_OPERATION', 400);
        }
        next(error);
    }
};

module.exports = {
    createShiftAssignment,
    getShiftAssignments,
    approveShiftAssignment,
    rejectShiftAssignment,
    removeShiftAssignment,
};
