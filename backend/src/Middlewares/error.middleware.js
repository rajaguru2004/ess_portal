const { errorResponse } = require('../Utils/response');

const errorHandler = (err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);

    // Prisma Unique Constraint Violation
    if (err.code === 'P2002') {
        const field = err.meta ? err.meta.target.join(', ') : 'field';
        return errorResponse(res, `${field} already exists`, 'ERR_DUPLICATE_ENTRY', 409);
    }

    // Prisma Record Not Found
    if (err.code === 'P2025') {
        return errorResponse(res, 'Record not found', 'ERR_not_FOUND', 404);
    }

    // JWT Errors (Fallback)
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 'AUTH_INVALID', 401);
    }
    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 'AUTH_EXPIRED', 401);
    }

    // Joi/Validation Errors (if not caught in validator)
    if (err.name === 'ValidationError') {
        return errorResponse(res, err.message, 'VALIDATION_ERROR', 400);
    }

    // Default Server Error
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message;

    return errorResponse(res, message, 'ERR_INTERNAL_SERVER', statusCode);
};

module.exports = { errorHandler };
