const express = require('express');
const router = express.Router();
const roleController = require('../Controllers/role.controller');
const { validateCreateRole } = require('../Validators/role.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

// GET /api/v1/roles
router.get('/', authenticate, roleController.getAllRoles);

// POST /api/v1/roles
router.post('/', authenticate, validateCreateRole, roleController.createRole);

module.exports = router;
