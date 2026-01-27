const express = require('express');
const router = express.Router();
const departmentController = require('../Controllers/department.controller');
const { validateCreateDepartment, validateUpdateDepartment } = require('../Validators/department.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

router.get('/', authenticate, departmentController.getAllDepartments);
router.get('/:id', authenticate, departmentController.getDepartmentById);
router.post('/', authenticate, validateCreateDepartment, departmentController.createDepartment);
router.put('/:id', authenticate, validateUpdateDepartment, departmentController.updateDepartment);
router.delete('/:id', authenticate, departmentController.deleteDepartment);

module.exports = router;
