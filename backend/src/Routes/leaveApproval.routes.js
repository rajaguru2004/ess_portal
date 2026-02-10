const express = require('express');
const router = express.Router();
const leaveApprovalController = require('../Controllers/leaveApproval.controller');
const { validateApproveLeave, validateRejectLeave } = require('../Validators/leaveApproval.validator');
const { authenticate, authorize } = require('../Middlewares/auth.middleware');

// GET /api/v1/leave-approval/pending - Get pending approvals
router.get('/pending', authenticate, authorize(['MANAGER', 'ADMIN']), leaveApprovalController.getPendingApprovals);

// POST /api/v1/leave-approval/:id/approve - Approve leave
router.post('/:id/approve', authenticate, authorize(['MANAGER', 'ADMIN']), validateApproveLeave, leaveApprovalController.approveLeave);

// POST /api/v1/leave-approval/:id/reject - Reject leave
router.post('/:id/reject', authenticate, authorize(['MANAGER', 'ADMIN']), validateRejectLeave, leaveApprovalController.rejectLeave);

// GET /api/v1/leave-approval/team-calendar - Get team calendar
router.get('/team-calendar', authenticate, authorize(['MANAGER', 'ADMIN']), leaveApprovalController.getTeamCalendar);

module.exports = router;
