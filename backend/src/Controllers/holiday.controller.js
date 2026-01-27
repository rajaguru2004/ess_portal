const holidayService = require('../Services/holiday.service');
const { successResponse, errorResponse } = require('../Utils/response');

const createHoliday = async (req, res, next) => {
    try {
        const holiday = await holidayService.createHoliday(req.body);
        successResponse(res, holiday, 'Holiday created successfully', 201);
    } catch (error) {
        next(error);
    }
};

const getAllHolidays = async (req, res, next) => {
    try {
        console.log('getAllHolidays - User:', req.user);
        const filter = {};
        if (req.user && req.user.tenantId && req.user.roleCode !== 'ADMIN') {
            filter.tenantId = req.user.tenantId;
        }
        console.log('getAllHolidays - Filter:', filter);
        const holidays = await holidayService.getAllHolidays(filter);
        console.log(`getAllHolidays - Found ${holidays.length} records`);
        successResponse(res, holidays, 'Holidays fetched successfully');
    } catch (error) {
        console.error('getAllHolidays - Error:', error);
        next(error);
    }
};

const getHolidayById = async (req, res, next) => {
    try {
        const holiday = await holidayService.getHolidayById(req.params.id);
        if (!holiday) return errorResponse(res, 'Holiday not found', 'NOT_FOUND', 404);
        successResponse(res, holiday, 'Holiday fetched successfully');
    } catch (error) {
        next(error);
    }
};

const updateHoliday = async (req, res, next) => {
    try {
        const holiday = await holidayService.updateHoliday(req.params.id, req.body);
        successResponse(res, holiday, 'Holiday updated successfully');
    } catch (error) {
        next(error);
    }
};

const deleteHoliday = async (req, res, next) => {
    try {
        await holidayService.deleteHoliday(req.params.id);
        successResponse(res, null, 'Holiday deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = { createHoliday, getAllHolidays, getHolidayById, updateHoliday, deleteHoliday };
