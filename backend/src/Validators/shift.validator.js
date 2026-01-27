const Joi = require('joi');

const createShiftSchema = Joi.object({
    tenantId: Joi.string().required(),
    name: Joi.string().required(),
    code: Joi.string().required().uppercase(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().required(),
    graceMinutes: Joi.number().optional(),
    breakMinutes: Joi.number().optional(),
    isRotational: Joi.boolean().optional()
});

const updateShiftSchema = Joi.object({
    name: Joi.string().optional(),
    code: Joi.string().optional().uppercase(),
    startTime: Joi.date().iso().optional(),
    endTime: Joi.date().iso().optional(),
    graceMinutes: Joi.number().optional(),
    breakMinutes: Joi.number().optional(),
    isRotational: Joi.boolean().optional(),
    isActive: Joi.boolean().optional()
});

const validateCreateShift = (req, res, next) => {
    const { error } = createShiftSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

const validateUpdateShift = (req, res, next) => {
    const { error } = updateShiftSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

module.exports = { validateCreateShift, validateUpdateShift };
