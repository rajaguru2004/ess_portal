/**
 * Standard Response Utility Functions
 * Provides consistent response format across all API endpoints
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
    const response = {
        success: true,
        message,
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {string} errorCode - Error code for debugging
 * @param {number} statusCode - HTTP status code (default: 400)
 */
const errorResponse = (res, message = 'An error occurred', errorCode = 'ERROR', statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errorCode,
    });
};

module.exports = {
    successResponse,
    errorResponse,
};
