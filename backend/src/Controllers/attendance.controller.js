const attendanceService = require('../Services/attendance.service');
const { successResponse, errorResponse } = require('../Utils/response');

/**
 * Attendance Controller
 * HTTP handlers for punch-in and punch-out endpoints
 */

/**
 * Check-In (Punch In) Controller
 * POST /api/v1/attendance/check-in
 */
const checkIn = async (req, res, next) => {
    try {
        const userId = req.user.userId; // From JWT
        const photo = req.file; // From Multer
        const { latitude, longitude, deviceInfo } = req.body;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Validate photo presence
        if (!photo) {
            return errorResponse(res, 'Photo is required', 'PHOTO_REQUIRED', 400);
        }

        const result = await attendanceService.checkIn(
            userId,
            photo,
            latitude,
            longitude,
            deviceInfo,
            ipAddress
        );

        return successResponse(res, result, 'Checked in successfully', 200);
    } catch (error) {
        // Map service errors to HTTP status codes
        let statusCode = 400;
        let errorCode = 'CHECKIN_FAILED';

        if (error.message === 'Already checked in') {
            statusCode = 409;
            errorCode = 'ALREADY_CHECKED_IN';
        } else if (error.message === 'Attendance already completed for today') {
            statusCode = 409;
            errorCode = 'ATTENDANCE_COMPLETED';
        } else if (error.message === 'Photo is required') {
            statusCode = 400;
            errorCode = 'PHOTO_REQUIRED';
        } else if (error.message === 'File upload failed') {
            statusCode = 500;
            errorCode = 'UPLOAD_FAILED';
        } else if (error.message === 'User not found') {
            statusCode = 404;
            errorCode = 'USER_NOT_FOUND';
        }

        // Handle known errors
        if (['Already checked in', 'Attendance already completed for today', 'Photo is required', 'User not found'].some(msg => error.message.includes(msg))) {
            return errorResponse(res, error.message, errorCode, statusCode);
        }

        // Pass unexpected errors to global handler
        next(error);
    }
};

/**
 * Check-Out (Punch Out) Controller
 * POST /api/v1/attendance/check-out
 */
const checkOut = async (req, res, next) => {
    try {
        const userId = req.user.userId; // From JWT
        const photo = req.file; // From Multer (optional)
        const { latitude, longitude, deviceInfo } = req.body;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const result = await attendanceService.checkOut(
            userId,
            latitude,
            longitude,
            photo,
            deviceInfo,
            ipAddress
        );

        return successResponse(res, result, 'Checked out successfully', 200);
    } catch (error) {
        // Map service errors to HTTP status codes
        let statusCode = 400;
        let errorCode = 'CHECKOUT_FAILED';

        if (error.message === 'Punch-in required') {
            statusCode = 400;
            errorCode = 'CHECKIN_REQUIRED';
        } else if (error.message === 'Already checked out') {
            statusCode = 409;
            errorCode = 'ALREADY_CHECKED_OUT';
        } else if (error.message === 'File upload failed') {
            statusCode = 500;
            errorCode = 'UPLOAD_FAILED';
        }

        // Handle known errors
        if (['Punch-in required', 'Already checked out'].some(msg => error.message.includes(msg))) {
            return errorResponse(res, error.message, errorCode, statusCode);
        }

        // Pass unexpected errors to global handler
        next(error);
    }
};

/**
 * Get Attendance Logs Controller
 * GET /api/v1/attendance/logs
 */
const getAttendanceLogs = async (req, res, next) => {
    try {
        const requestingUser = req.user; // From JWT
        const { startDate, endDate } = req.query;

        const logs = await attendanceService.getAttendanceLogs(requestingUser, startDate, endDate);

        return successResponse(res, logs, 'Attendance logs fetched successfully', 200);
    } catch (error) {
        // Pass unexpected errors to global handler
        next(error);
    }
};

module.exports = {
    checkIn,
    checkOut,
    getAttendanceLogs,
};
