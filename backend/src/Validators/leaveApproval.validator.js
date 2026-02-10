const Joi = require('joi');

/**
 * Leave Approval Validators
 */

const validateApproveLeave = (req, res, next) => {
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

const rejectLeaveSchema = Joi.object({
    reason: Joi.string().min(5).max(500).required().messages({
        'string.min': 'Rejection reason must be at least 5 characters',
        'string.max': 'Rejection reason cannot exceed 500 characters',
        'any.required': 'Rejection reason is required'
    })
});

const validateRejectLeave = (req, res, next) => {
    const { id } = req.params;

    // Validate ID
    const idSchema = Joi.string().uuid().required();
    const { error: idError } = idSchema.validate(id);

    if (idError) {
        return res.status(400).json({
            success: false,
            message: 'Invalid leave application ID',
            errorCode: 'VALIDATION_ERROR'
        });
    }

    // Validate body
    const { error: bodyError } = rejectLeaveSchema.validate(req.body);
    if (bodyError) {
        return res.status(400).json({
            success: false,
            message: bodyError.details[0].message,
            errorCode: 'VALIDATION_ERROR'
        });
    }

    next();
};

module.exports = {
    validateApproveLeave,
    validateRejectLeave
};
