const Joi = require('joi');

/**
 * User Hierarchy Validators
 */

const makeManagerSchema = Joi.object({
    id: Joi.string().uuid().required().messages({
        'string.guid': 'User ID must be a valid UUID',
        'any.required': 'User ID is required'
    })
});

const assignManagerSchema = Joi.object({
    employeeId: Joi.string().uuid().required().messages({
        'string.guid': 'Employee ID must be a valid UUID',
        'any.required': 'Employee ID is required'
    }),
    managerId: Joi.string().uuid().required().messages({
        'string.guid': 'Manager ID must be a valid UUID',
        'any.required': 'Manager ID is required'
    })
});

/**
 * Validate Make Manager Request
 */
const validateMakeManager = (req, res, next) => {
    const { error } = makeManagerSchema.validate({ id: req.params.id });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
            errorCode: 'VALIDATION_ERROR'
        });
    }
    next();
};

/**
 * Validate Assign Employee to Manager Request
 */
const validateAssignManager = (req, res, next) => {
    const { error } = assignManagerSchema.validate({
        employeeId: req.params.employeeId,
        managerId: req.body.managerId
    });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
            errorCode: 'VALIDATION_ERROR'
        });
    }
    next();
};

module.exports = {
    validateMakeManager,
    validateAssignManager
};
