const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user.controller');
const { validateCreateUser } = require('../Validators/user.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

// POST /api/v1/users
// Protected (auth required) + Admin check (handled in controller) + Validation
router.post('/', authenticate, validateCreateUser, userController.createUser);

// GET /api/v1/users
// Protected
router.get('/', authenticate, userController.getAllUsers);

module.exports = router;
