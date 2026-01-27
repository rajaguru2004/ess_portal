const express = require('express');
const router = express.Router();
const roleController = require('../Controllers/role.controller');
const { validateCreateRole } = require('../Validators/role.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

// GET /api/v1/roles
router.get('/', authenticate, roleController.getAllRoles);

// POST /api/v1/roles
router.post('/', authenticate, validateCreateRole, roleController.createRole);

// GET /api/v1/roles/:id
router.get('/:id', authenticate, roleController.getRoleById);

// PUT /api/v1/roles/:id
router.put('/:id', authenticate, roleController.updateRole);

// DELETE /api/v1/roles/:id
router.delete('/:id', authenticate, roleController.deleteRole);

module.exports = router;
