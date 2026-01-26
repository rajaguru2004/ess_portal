/**
 * Global error handling middleware
 * Catches all errors and formats them for client response
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });

    // Default error status and message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Prisma-specific errors
    if (err.code && err.code.startsWith('P')) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Database error occurred',
                code: err.code,
                details: process.env.NODE_ENV === 'development' ? err.meta : undefined,
            },
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: {
                message: 'Invalid or expired token',
                type: err.name,
            },
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation error',
                details: err.details || err.message,
            },
        });
    }

    // Generic error response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.path} not found`,
        },
    });
};

module.exports = {
    errorHandler,
    notFoundHandler,
};
