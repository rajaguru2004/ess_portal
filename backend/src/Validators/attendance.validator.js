const Joi = require('joi');
const { errorResponse } = require('../Utils/response');

/**
 * Validation Schemas for Attendance APIs
 */

/**
 * Check-in validation schema
 */
const checkInSchema = Joi.object({
    latitude: Joi.string()
        .required()
        .pattern(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/)
        .messages({
            'string.pattern.base': 'Invalid latitude format',
            'any.required': 'Latitude is required',
        }),
    longitude: Joi.string()
        .required()
        .pattern(/^-?((1[0-7][0-9])|([0-9]?[0-9]))(\.[0-9]{1,10})?$/)
        .messages({
            'string.pattern.base': 'Invalid longitude format',
            'any.required': 'Longitude is required',
        }),
    deviceInfo: Joi.string().optional().allow(''),
});

/**
 * Check-out validation schema
 */
const checkOutSchema = Joi.object({
    latitude: Joi.string()
        .required()
        .pattern(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/)
        .messages({
            'string.pattern.base': 'Invalid latitude format',
            'any.required': 'Latitude is required',
        }),
    longitude: Joi.string()
        .required()
        .pattern(/^-?((1[0-7][0-9])|([0-9]?[0-9]))(\.[0-9]{1,10})?$/)
        .messages({
            'string.pattern.base': 'Invalid longitude format',
            'any.required': 'Longitude is required',
        }),
    deviceInfo: Joi.string().optional().allow(''),
});

/**
 * Validate check-in request
 */
const validateCheckIn = (req, res, next) => {
    const { error } = checkInSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const message = error.details.map(d => d.message).join(', ');
        return errorResponse(res, message, 'VALIDATION_ERROR', 400);
    }

    next();
};

/**
 * Validate check-out request
 */
const validateCheckOut = (req, res, next) => {
    const { error } = checkOutSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const message = error.details.map(d => d.message).join(', ');
        return errorResponse(res, message, 'VALIDATION_ERROR', 400);
    }

    next();
};

module.exports = {
    validateCheckIn,
    validateCheckOut,
};
