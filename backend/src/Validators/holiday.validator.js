const Joi = require('joi');

const createHolidaySchema = Joi.object({
    tenantId: Joi.string().required(),
    branchId: Joi.string().optional().allow(null),
    name: Joi.string().required(),
    date: Joi.date().iso().required(),
    type: Joi.string().valid('ORGANIZATION', 'LOCATION').required()
});

const updateHolidaySchema = Joi.object({
    name: Joi.string().optional(),
    date: Joi.date().iso().optional(),
    type: Joi.string().valid('ORGANIZATION', 'LOCATION').optional(),
    branchId: Joi.string().optional().allow(null)
});

const validateCreateHoliday = (req, res, next) => {
    const { error } = createHolidaySchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

const validateUpdateHoliday = (req, res, next) => {
    const { error } = updateHolidaySchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

module.exports = { validateCreateHoliday, validateUpdateHoliday };
