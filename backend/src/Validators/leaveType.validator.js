const Joi = require('joi');

const createLeaveTypeSchema = Joi.object({
    tenantId: Joi.string().required(),
    name: Joi.string().required(),
    code: Joi.string().required().uppercase(),
    defaultDays: Joi.number().integer().min(0).required(),
    carryForwardAllowed: Joi.boolean().optional(),
    maxCarryForward: Joi.number().integer().optional().allow(null),
    encashmentAllowed: Joi.boolean().optional()
});

const updateLeaveTypeSchema = Joi.object({
    name: Joi.string().optional(),
    code: Joi.string().optional().uppercase(),
    defaultDays: Joi.number().integer().min(0).optional(),
    carryForwardAllowed: Joi.boolean().optional(),
    maxCarryForward: Joi.number().integer().optional().allow(null),
    encashmentAllowed: Joi.boolean().optional(),
    isActive: Joi.boolean().optional()
});

const validateCreateLeaveType = (req, res, next) => {
    const { error } = createLeaveTypeSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

const validateUpdateLeaveType = (req, res, next) => {
    const { error } = updateLeaveTypeSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

module.exports = { validateCreateLeaveType, validateUpdateLeaveType };
