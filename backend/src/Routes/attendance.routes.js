const express = require('express');
const router = express.Router();

const attendanceController = require('../Controllers/attendance.controller');
const { authenticate } = require('../Middlewares/auth.middleware');
const { uploadPhoto } = require('../Middlewares/upload.middleware');
const { validateCheckIn, validateCheckOut } = require('../Validators/attendance.validator');

/**
 * Attendance Routes
 * All routes require authentication
 */

/**
 * @route   POST /api/v1/attendance/check-in
 * @desc    Punch in (check-in) with photo
 * @access  Private
 */
router.post(
    '/check-in',
    authenticate,
    uploadPhoto,
    validateCheckIn,
    attendanceController.checkIn
);

/**
 * @route   POST /api/v1/attendance/check-out
 * @desc    Punch out (check-out) with optional photo
 * @access  Private
 */
router.post(
    '/check-out',
    authenticate,
    uploadPhoto,
    validateCheckOut,
    attendanceController.checkOut
);

/**
 * @route   GET /api/v1/attendance/logs
 * @desc    Get attendance logs with photo URLs
 * @access  Private
 * @query   startDate (optional) - Start date (YYYY-MM-DD)
 * @query   endDate (optional) - End date (YYYY-MM-DD)
 */
router.get(
    '/logs',
    authenticate,
    attendanceController.getAttendanceLogs
);

module.exports = router;
