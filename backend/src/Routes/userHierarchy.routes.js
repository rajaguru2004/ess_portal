const express = require('express');
const router = express.Router();
const userHierarchyController = require('../Controllers/userHierarchy.controller');
const { validateMakeManager, validateAssignManager } = require('../Validators/userHierarchy.validator');
const { authenticate, authorize } = require('../Middlewares/auth.middleware');
const { requireHeadManager } = require('../Middlewares/hierarchy.middleware');

/**
 * User Hierarchy Routes
 * All routes require HEAD MANAGER authorization
 */

// PATCH /api/v1/users/:id/make-head-manager - Promote to Head Manager (ADMIN only)
router.patch(
    '/:id/make-head-manager',
    authenticate,
    authorize(['ADMIN']),
    validateMakeManager,
    userHierarchyController.makeHeadManager
);

// PATCH /api/v1/users/:id/make-manager - Assign manager role to employee
router.patch(
    '/:id/make-manager',
    authenticate,
    requireHeadManager,
    validateMakeManager,
    userHierarchyController.makeManager
);

// PATCH /api/v1/users/:employeeId/assign-manager - Assign employee to manager
router.patch(
    '/:employeeId/assign-manager',
    authenticate,
    requireHeadManager,
    validateAssignManager,
    userHierarchyController.assignEmployeeToManager
);

// GET /api/v1/users/managers - Get all managers
router.get(
    '/managers',
    authenticate,
    userHierarchyController.getAllManagers
);

// GET /api/v1/users/:id/hierarchy - Get user hierarchy
router.get(
    '/:id/hierarchy',
    authenticate,
    userHierarchyController.getHierarchy
);

module.exports = router;
