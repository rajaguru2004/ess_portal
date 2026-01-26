const Joi = require('joi');

const createRoleSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Role name is required',
        'any.required': 'Role name is required'
    }),
    code: Joi.string().required().uppercase().messages({
        'string.empty': 'Role code is required',
        'any.required': 'Role code is required'
    }),
    description: Joi.string().allow(null, ''),
    isSystemRole: Joi.boolean().default(false)
});

const validateCreateRole = (req, res, next) => {
    const { error } = createRoleSchema.validate(req.body);
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
    validateCreateRole
};
