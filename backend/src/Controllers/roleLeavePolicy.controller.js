const policyService = require('../Services/roleLeavePolicy.service');
const { successResponse, errorResponse } = require('../Utils/response');

const createPolicy = async (req, res, next) => {
    try {
        const policy = await policyService.createRoleLeavePolicy(req.body);
        successResponse(res, policy, 'Leave Policy created successfully', 201);
    } catch (error) {
        if (error.message.includes('already exists')) return errorResponse(res, error.message, 'DUPLICATE_ENTRY', 409);
        next(error);
    }
};

const getAllPolicies = async (req, res, next) => {
    try {
        const policies = await policyService.getAllPolicies();
        successResponse(res, policies, 'Leave Policies fetched successfully');
    } catch (error) {
        next(error);
    }
};

const getPolicyById = async (req, res, next) => {
    try {
        const policy = await policyService.getPolicyById(req.params.id);
        if (!policy) return errorResponse(res, 'Policy not found', 'NOT_FOUND', 404);
        successResponse(res, policy, 'Policy fetched successfully');
    } catch (error) {
        next(error);
    }
};

const updatePolicy = async (req, res, next) => {
    try {
        const policy = await policyService.updatePolicy(req.params.id, req.body);
        successResponse(res, policy, 'Policy updated successfully');
    } catch (error) {
        next(error);
    }
};

const deletePolicy = async (req, res, next) => {
    try {
        await policyService.deletePolicy(req.params.id);
        successResponse(res, null, 'Policy deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = { createPolicy, getAllPolicies, getPolicyById, updatePolicy, deletePolicy };
