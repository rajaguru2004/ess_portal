const shiftService = require('../Services/shift.service');
const { successResponse, errorResponse } = require('../Utils/response');

const createShift = async (req, res, next) => {
    try {
        const shift = await shiftService.createShift(req.body);
        successResponse(res, shift, 'Shift created successfully', 201);
    } catch (error) {
        if (error.message.includes('already exists')) return errorResponse(res, error.message, 'DUPLICATE_ENTRY', 409);
        next(error);
    }
};

const getAllShifts = async (req, res, next) => {
    try {
        console.log('getAllShifts - User:', req.user);
        const filter = {};
        if (req.user && req.user.tenantId && req.user.roleCode !== 'ADMIN') {
            filter.tenantId = req.user.tenantId;
        }
        console.log('getAllShifts - Filter:', filter);
        const shifts = await shiftService.getAllShifts(filter);
        console.log(`getAllShifts - Found ${shifts.length} records`);
        successResponse(res, shifts, 'Shifts fetched successfully');
    } catch (error) {
        console.error('getAllShifts - Error:', error);
        next(error);
    }
};

const getShiftById = async (req, res, next) => {
    try {
        const shift = await shiftService.getShiftById(req.params.id);
        if (!shift) return errorResponse(res, 'Shift not found', 'NOT_FOUND', 404);
        successResponse(res, shift, 'Shift fetched successfully');
    } catch (error) {
        next(error);
    }
};

const updateShift = async (req, res, next) => {
    try {
        const shift = await shiftService.updateShift(req.params.id, req.body);
        successResponse(res, shift, 'Shift updated successfully');
    } catch (error) {
        next(error);
    }
};

const deleteShift = async (req, res, next) => {
    try {
        await shiftService.deleteShift(req.params.id);
        successResponse(res, null, 'Shift deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = { createShift, getAllShifts, getShiftById, updateShift, deleteShift };
