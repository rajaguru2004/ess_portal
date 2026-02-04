const express = require('express');
const router = express.Router();
const shiftAssignmentController = require('../Controllers/shiftAssignment.controller');
const {
    validateCreateShiftAssignment,
    validateRejectShiftAssignment,
    validateGetShiftAssignments,
} = require('../Validators/shiftAssignment.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

// Create shift assignment request (Employee/System)
router.post(
    '/',
    authenticate,
    validateCreateShiftAssignment,
    shiftAssignmentController.createShiftAssignment
);

// Get shift assignments with filters (Admin only - checked in controller)
router.get(
    '/',
    authenticate,
    validateGetShiftAssignments,
    shiftAssignmentController.getShiftAssignments
);

// Approve shift assignment (Admin only - checked in controller)
router.post(
    '/:id/approve',
    authenticate,
    shiftAssignmentController.approveShiftAssignment
);

// Reject shift assignment (Admin only - checked in controller)
router.post(
    '/:id/reject',
    authenticate,
    validateRejectShiftAssignment,
    shiftAssignmentController.rejectShiftAssignment
);

// Remove shift assignment (Admin only - checked in controller)
router.delete(
    '/:id',
    authenticate,
    shiftAssignmentController.removeShiftAssignment
);

module.exports = router;
