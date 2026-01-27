const express = require('express');
const router = express.Router();
const shiftController = require('../Controllers/shift.controller');
const { validateCreateShift, validateUpdateShift } = require('../Validators/shift.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

router.get('/', authenticate, shiftController.getAllShifts);
router.get('/:id', authenticate, shiftController.getShiftById);
router.post('/', authenticate, validateCreateShift, shiftController.createShift);
router.put('/:id', authenticate, validateUpdateShift, shiftController.updateShift);
router.delete('/:id', authenticate, shiftController.deleteShift);

module.exports = router;
