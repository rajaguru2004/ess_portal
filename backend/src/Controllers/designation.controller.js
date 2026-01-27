const designationService = require('../Services/designation.service');
const { successResponse, errorResponse } = require('../Utils/response');

const createDesignation = async (req, res, next) => {
    try {
        const designation = await designationService.createDesignation(req.body);
        successResponse(res, designation, 'Designation created successfully', 201);
    } catch (error) {
        if (error.message.includes('already exists')) return errorResponse(res, error.message, 'DUPLICATE_ENTRY', 409);
        next(error);
    }
};

const getAllDesignations = async (req, res, next) => {
    try {
        console.log('getAllDesignations - User:', req.user);
        const filter = {};
        if (req.user && req.user.tenantId && req.user.roleCode !== 'ADMIN') {
            filter.tenantId = req.user.tenantId;
        }
        console.log('getAllDesignations - Filter:', filter);
        const designations = await designationService.getAllDesignations(filter);
        console.log(`getAllDesignations - Found ${designations.length} records`);
        successResponse(res, designations, 'Designations fetched successfully');
    } catch (error) {
        console.error('getAllDesignations - Error:', error);
        next(error);
    }
};

const getDesignationById = async (req, res, next) => {
    try {
        const designation = await designationService.getDesignationById(req.params.id);
        if (!designation) return errorResponse(res, 'Designation not found', 'NOT_FOUND', 404);
        successResponse(res, designation, 'Designation fetched successfully');
    } catch (error) {
        next(error);
    }
};

const updateDesignation = async (req, res, next) => {
    try {
        const designation = await designationService.updateDesignation(req.params.id, req.body);
        successResponse(res, designation, 'Designation updated successfully');
    } catch (error) {
        next(error);
    }
};

const deleteDesignation = async (req, res, next) => {
    try {
        await designationService.deleteDesignation(req.params.id);
        successResponse(res, null, 'Designation deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = { createDesignation, getAllDesignations, getDesignationById, updateDesignation, deleteDesignation };
