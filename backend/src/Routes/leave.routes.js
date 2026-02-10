const express = require('express');
const router = express.Router();
const leaveController = require('../Controllers/leave.controller');
const { validateApplyLeave, validateCancelLeave } = require('../Validators/leave.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

// POST /api/v1/leave/apply - Apply for leave
router.post('/apply', authenticate, validateApplyLeave, leaveController.applyLeave);

// GET /api/v1/leave/my-leaves - Get employee's leave history
router.get('/my-leaves', authenticate, leaveController.getMyLeaves);

// GET /api/v1/leave/balance - Get leave balance
router.get('/balance', authenticate, leaveController.getLeaveBalance);

// DELETE /api/v1/leave/:id/cancel - Cancel leave
router.delete('/:id/cancel', authenticate, validateCancelLeave, leaveController.cancelLeave);

module.exports = router;
