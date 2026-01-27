const express = require('express');
const router = express.Router();
const holidayController = require('../Controllers/holiday.controller');
const { validateCreateHoliday, validateUpdateHoliday } = require('../Validators/holiday.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

router.get('/', authenticate, holidayController.getAllHolidays);
router.get('/:id', authenticate, holidayController.getHolidayById);
router.post('/', authenticate, validateCreateHoliday, holidayController.createHoliday);
router.put('/:id', authenticate, validateUpdateHoliday, holidayController.updateHoliday);
router.delete('/:id', authenticate, holidayController.deleteHoliday);

module.exports = router;
