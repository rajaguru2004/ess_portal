const express = require('express');
const router = express.Router();
const designationController = require('../Controllers/designation.controller');
const { validateCreateDesignation, validateUpdateDesignation } = require('../Validators/designation.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

router.get('/', authenticate, designationController.getAllDesignations);
router.get('/:id', authenticate, designationController.getDesignationById);
router.post('/', authenticate, validateCreateDesignation, designationController.createDesignation);
router.put('/:id', authenticate, validateUpdateDesignation, designationController.updateDesignation);
router.delete('/:id', authenticate, designationController.deleteDesignation);

module.exports = router;
