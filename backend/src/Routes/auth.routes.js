const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.controller');
const { validateLogin, validateChangePassword } = require('../Validators/auth.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

// POST /api/v1/auth/login
router.post('/login', validateLogin, authController.login);

// POST /api/v1/auth/change-password
router.post('/change-password', authenticate, validateChangePassword, authController.changePassword);

module.exports = router;
