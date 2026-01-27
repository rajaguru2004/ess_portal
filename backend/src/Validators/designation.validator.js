const Joi = require('joi');

const createDesignationSchema = Joi.object({
    tenantId: Joi.string().required(),
    name: Joi.string().required(),
    code: Joi.string().required().uppercase()
});

const updateDesignationSchema = Joi.object({
    name: Joi.string().optional(),
    code: Joi.string().optional().uppercase(),
    isActive: Joi.boolean().optional()
});

const validateCreateDesignation = (req, res, next) => {
    const { error } = createDesignationSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

const validateUpdateDesignation = (req, res, next) => {
    const { error } = updateDesignationSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, errorCode: 'VALIDATION_ERROR' });
    next();
};

module.exports = { validateCreateDesignation, validateUpdateDesignation };
