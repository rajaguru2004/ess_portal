const Joi = require('joi');

const createPolicySchema = Joi.object({
    roleId: Joi.string().required(),
    leaveTypeId: Joi.string().required(),
    annualQuota: Joi.number().integer().min(0).required(),
    accrualType: Joi.string().valid('ANNUAL', 'MONTHLY', 'PRORATED').required()
});

const updatePolicySchema = Joi.object({
    annualQuota: Joi.number().integer().min(0).optional(),
    accrualType: Joi.string().valid('ANNUAL', 'MONTHLY', 'PRORATED').optional(),
    isActive: Joi.boolean().optional()
});

const validateCreatePolicy = (req, res, next) => {
    const { error } = createPolicySchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

const validateUpdatePolicy = (req, res, next) => {
    const { error } = updatePolicySchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

module.exports = { validateCreatePolicy, validateUpdatePolicy };
