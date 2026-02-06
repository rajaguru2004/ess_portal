const express = require('express');
const router = express.Router();
const EmployeeShiftController = require('../Controllers/employeeShift.controller');
const { authenticate } = require('../Middlewares/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/v1/employee/shifts/today
router.get('/today', EmployeeShiftController.getTodayShift);

// GET /api/v1/employee/shifts/upcoming
router.get('/upcoming', EmployeeShiftController.getUpcomingShifts);

module.exports = router;
