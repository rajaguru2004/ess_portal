const express = require('express');
const router = express.Router();
const policyController = require('../Controllers/roleLeavePolicy.controller');
const { validateCreatePolicy, validateUpdatePolicy } = require('../Validators/roleLeavePolicy.validator');
const { authenticate } = require('../Middlewares/auth.middleware');

router.get('/', authenticate, policyController.getAllPolicies);
router.get('/:id', authenticate, policyController.getPolicyById);
router.post('/', authenticate, validateCreatePolicy, policyController.createPolicy);
router.put('/:id', authenticate, validateUpdatePolicy, policyController.updatePolicy);
router.delete('/:id', authenticate, policyController.deletePolicy);

module.exports = router;
