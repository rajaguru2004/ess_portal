const leaveTypeService = require('../Services/leaveType.service');
const { successResponse, errorResponse } = require('../Utils/response');

const createLeaveType = async (req, res, next) => {
    try {
        const leaveType = await leaveTypeService.createLeaveType(req.body);
        successResponse(res, leaveType, 'Leave Type created successfully', 201);
    } catch (error) {
        if (error.message.includes('already exists')) return errorResponse(res, error.message, 'DUPLICATE_ENTRY', 409);
        next(error);
    }
};

const getAllLeaveTypes = async (req, res, next) => {
    try {
        console.log('getAllLeaveTypes - User:', req.user);
        const filter = {};
        if (req.user && req.user.tenantId && req.user.roleCode !== 'ADMIN') {
            filter.tenantId = req.user.tenantId;
        }
        console.log('getAllLeaveTypes - Filter:', filter);
        const leaveTypes = await leaveTypeService.getAllLeaveTypes(filter);
        console.log(`getAllLeaveTypes - Found ${leaveTypes.length} records`);
        successResponse(res, leaveTypes, 'Leave Types fetched successfully');
    } catch (error) {
        console.error('getAllLeaveTypes - Error:', error);
        next(error);
    }
};

const getLeaveTypeById = async (req, res, next) => {
    try {
        const leaveType = await leaveTypeService.getLeaveTypeById(req.params.id);
        if (!leaveType) return errorResponse(res, 'Leave Type not found', 'NOT_FOUND', 404);
        successResponse(res, leaveType, 'Leave Type fetched successfully');
    } catch (error) {
        next(error);
    }
};

const updateLeaveType = async (req, res, next) => {
    try {
        const leaveType = await leaveTypeService.updateLeaveType(req.params.id, req.body);
        successResponse(res, leaveType, 'Leave Type updated successfully');
    } catch (error) {
        next(error);
    }
};

const deleteLeaveType = async (req, res, next) => {
    try {
        await leaveTypeService.deleteLeaveType(req.params.id);
        successResponse(res, null, 'Leave Type deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = { createLeaveType, getAllLeaveTypes, getLeaveTypeById, updateLeaveType, deleteLeaveType };
