const Joi = require('joi');

const createDepartmentSchema = Joi.object({
    tenantId: Joi.string().required(),
    branchId: Joi.string().required(),
    name: Joi.string().required(),
    code: Joi.string().required().uppercase(),
    managerId: Joi.string().optional().allow(null)
});

const updateDepartmentSchema = Joi.object({
    name: Joi.string().optional(),
    code: Joi.string().optional().uppercase(),
    managerId: Joi.string().optional().allow(null),
    isActive: Joi.boolean().optional()
});

const validateCreateDepartment = (req, res, next) => {
    const { error } = createDepartmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
            errorCode: 'VALIDATION_ERROR'
        });
    }
    next();
};

const validateUpdateDepartment = (req, res, next) => {
    const { error } = updateDepartmentSchema.validate(req.body);
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
    validateCreateDepartment,
    validateUpdateDepartment
};
