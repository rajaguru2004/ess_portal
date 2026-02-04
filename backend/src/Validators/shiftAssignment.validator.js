const Joi = require('joi');
const { errorResponse } = require('../Utils/response');

/**
 * Validation Schemas for Shift Assignment APIs
 */

/**
 * Create shift assignment schema
 */
const createShiftAssignmentSchema = Joi.object({
    userId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Invalid user ID format',
            'any.required': 'User ID is required',
        }),
    shiftId: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'Invalid shift ID format',
            'any.required': 'Shift ID is required',
        }),
    date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.format': 'Invalid date format, expected YYYY-MM-DD',
            'any.required': 'Date is required',
        }),
});

/**
 * Reject shift assignment schema
 */
const rejectShiftAssignmentSchema = Joi.object({
    reason: Joi.string()
        .min(3)
        .max(500)
        .required()
        .messages({
            'string.min': 'Rejection reason must be at least 3 characters',
            'string.max': 'Rejection reason must not exceed 500 characters',
            'any.required': 'Rejection reason is required',
        }),
});

/**
 * Query params schema for getting shift assignments
 */
const getShiftAssignmentsQuerySchema = Joi.object({
    status: Joi.string()
        .valid('PENDING', 'APPROVED', 'REJECTED')
        .optional()
        .messages({
            'any.only': 'Status must be one of: PENDING, APPROVED, REJECTED',
        }),
    date: Joi.date()
        .iso()
        .optional()
        .messages({
            'date.format': 'Invalid date format, expected YYYY-MM-DD',
        }),
    userId: Joi.string()
        .uuid()
        .optional()
        .messages({
            'string.guid': 'Invalid user ID format',
        }),
});

/**
 * Validate create shift assignment request
 */
const validateCreateShiftAssignment = (req, res, next) => {
    const { error } = createShiftAssignmentSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const message = error.details.map(d => d.message).join(', ');
        return errorResponse(res, message, 'VALIDATION_ERROR', 400);
    }

    next();
};

/**
 * Validate reject shift assignment request
 */
const validateRejectShiftAssignment = (req, res, next) => {
    const { error } = rejectShiftAssignmentSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const message = error.details.map(d => d.message).join(', ');
        return errorResponse(res, message, 'VALIDATION_ERROR', 400);
    }

    next();
};

/**
 * Validate get shift assignments query params
 */
const validateGetShiftAssignments = (req, res, next) => {
    const { error } = getShiftAssignmentsQuerySchema.validate(req.query, { abortEarly: false });

    if (error) {
        const message = error.details.map(d => d.message).join(', ');
        return errorResponse(res, message, 'VALIDATION_ERROR', 400);
    }

    next();
};

module.exports = {
    validateCreateShiftAssignment,
    validateRejectShiftAssignment,
    validateGetShiftAssignments,
};
