const Joi = require('joi');

/**
 * Leave Application Validators
 */

const applyLeaveSchema = Joi.object({
    leaveTypeId: Joi.string().uuid().required().messages({
        'string.guid': 'Leave type ID must be a valid UUID',
        'any.required': 'Leave type ID is required'
    }),
    startDate: Joi.date().iso().required().messages({
        'date.base': 'Start date must be a valid date',
        'any.required': 'Start date is required'
    }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
        'date.base': 'End date must be a valid date',
        'date.min': 'End date cannot be before start date',
        'any.required': 'End date is required'
    }),
    halfDayType: Joi.string().valid('FIRST_HALF', 'SECOND_HALF').optional().allow(null),
    reason: Joi.string().min(5).max(500).required().messages({
        'string.min': 'Reason must be at least 5 characters',
        'string.max': 'Reason cannot exceed 500 characters',
        'any.required': 'Reason is required'
    })
});

const validateApplyLeave = (req, res, next) => {
    const { error } = applyLeaveSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
            errorCode: 'VALIDATION_ERROR'
        });
    }
    next();
};

const validateCancelLeave = (req, res, next) => {
    const { id } = req.params;

    const schema = Joi.string().uuid().required();
    const { error } = schema.validate(id);

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid leave application ID',
            errorCode: 'VALIDATION_ERROR'
        });
    }
    next();
};

module.exports = {
    validateApplyLeave,
    validateCancelLeave
};
