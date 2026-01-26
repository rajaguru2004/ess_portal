const { verifyToken } = require('../Utils/jwt');
const { errorResponse } = require('../Utils/response');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'Authorization header missing or invalid', 'AUTH_001', 401);
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return errorResponse(res, 'Token missing', 'AUTH_002', 401);
        }

        try {
            const decoded = verifyToken(token);
            req.user = decoded; // Attach user payload to request
            next();
        } catch (error) {
            // verifyToken throws specific errors
            if (error.message === 'Token expired') {
                return errorResponse(res, 'Token expired', 'AUTH_004', 401);
            }
            return errorResponse(res, 'Invalid token', 'AUTH_005', 401);
        }

    } catch (error) {
        console.error('Authentication Middleware Error:', error);
        return errorResponse(res, 'Internal Server Error', 'AUTH_006', 500);
    }
};

module.exports = { authenticate };
