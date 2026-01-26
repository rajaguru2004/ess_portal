const Joi = require('joi');

const createUserSchema = Joi.object({
    employeeCode: Joi.string().required().messages({
        'string.empty': 'Employee code is required',
        'any.required': 'Employee code is required'
    }),
    username: Joi.string().required().min(3).max(30).messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
    }),
    password: Joi.string().required().min(6).messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    fullName: Joi.string().required().messages({
        'string.empty': 'Full Name is required',
        'any.required': 'Full Name is required'
    }),
    email: Joi.string().email().allow(null, '').messages({
        'string.email': 'Invalid email format'
    }),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).allow(null, '').messages({
        'string.pattern.base': 'Mobile number must be 10 digits'
    }),
    tenantId: Joi.string().required().messages({
        'any.required': 'Tenant ID is required'
    }),
    branchId: Joi.string().required().messages({
        'any.required': 'Branch ID is required'
    }),
    departmentId: Joi.string().required().messages({
        'any.required': 'Department ID is required'
    }),
    roleId: Joi.string().required().messages({
        'string.guid': 'Invalid Role ID format',
        'any.required': 'Role ID is required'
    }),
    managerId: Joi.string().allow(null, '').messages({
        'string.guid': 'Invalid Manager ID format'
    })
});

const validateCreateUser = (req, res, next) => {
    const { error } = createUserSchema.validate(req.body);
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
    validateCreateUser
};
