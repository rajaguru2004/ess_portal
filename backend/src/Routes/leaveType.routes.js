const express = require('express');
const router = express.Router();
const leaveTypeController = require('../Controllers/leaveType.controller');
const { validateCreateLeaveType, validateUpdateLeaveType } = require('../Validators/leaveType.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

router.get('/', authenticate, leaveTypeController.getAllLeaveTypes);
router.get('/:id', authenticate, leaveTypeController.getLeaveTypeById);
router.post('/', authenticate, validateCreateLeaveType, leaveTypeController.createLeaveType);
router.put('/:id', authenticate, validateUpdateLeaveType, leaveTypeController.updateLeaveType);
router.delete('/:id', authenticate, leaveTypeController.deleteLeaveType);

module.exports = router;
