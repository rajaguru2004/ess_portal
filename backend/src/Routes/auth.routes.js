const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.controller');
const { validateLogin } = require('../Validators/auth.validator');

// POST /api/v1/auth/login
router.post('/login', validateLogin, authController.login);

module.exports = router;
