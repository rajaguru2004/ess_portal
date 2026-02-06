const authService = require('../Services/auth.service');
const { successResponse, errorResponse } = require('../Utils/response');

/**
 * Login Controller
 */
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const result = await authService.login(username, password, clientIp);

        return successResponse(res, result, 'Login successful');
    } catch (error) {
        // Map service errors to HTTP status codes
        let statusCode = 401; // Default to unauthorized for login failures
        let errorCode = 'AUTH_FAILED';

        if (error.message === 'Account disabled') {
            statusCode = 403;
            errorCode = 'AUTH_DISABLED';
        } else if (error.message === 'Account locked' || error.message.includes('locked')) {
            statusCode = 403;
            errorCode = 'AUTH_LOCKED';
        }

        // For internal errors, let the global error handler deal with it? 
        // Or just pass the error message if it's a known operational error.
        // If it's a generic Error from service, we might want to return 401/403.
        // However, if we pass it to next(error), the global handler might treat it as 500 if we don't attach status.

        // Let's manually handle expected service errors here
        if (['Invalid credentials', 'Account disabled', 'Account locked', 'Account locked due to multiple failed attempts'].some(msg => error.message.includes(msg))) {
            return errorResponse(res, error.message, errorCode, statusCode);
        }

        next(error); // Pass unexpected errors to global handler
    }
};

/**
 * Change Password Controller
 */
const changePassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user.userId;

        await authService.changePassword(userId, newPassword);

        return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    changePassword
};
