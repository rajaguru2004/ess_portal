const departmentService = require('../Services/department.service');
const { successResponse, errorResponse } = require('../Utils/response');

const createDepartment = async (req, res, next) => {
    try {
        const department = await departmentService.createDepartment(req.body);
        return successResponse(res, department, 'Department created successfully', 201);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return errorResponse(res, error.message, 'DUPLICATE_ENTRY', 409);
        }
        next(error);
    }
};

const getAllDepartments = async (req, res, next) => {
    try {
        console.log('getAllDepartments - User:', req.user);

        // Optional: filter by user's tenant if not super admin
        const filter = {};
        if (req.user && req.user.tenantId && req.user.roleCode !== 'ADMIN') {
            console.log('getAllDepartments - Applying Tenant Filter:', req.user.tenantId);
            filter.tenantId = req.user.tenantId;
        } else {
            console.log('getAllDepartments - No Tenant Filter (Admin or No Tenant)');
        }

        console.log('getAllDepartments - Final Filter:', filter);

        const departments = await departmentService.getAllDepartments(filter);
        console.log(`getAllDepartments - Found ${departments.length} records`);

        return successResponse(res, departments, 'Departments fetched successfully');
    } catch (error) {
        console.error('getAllDepartments - Error:', error);
        next(error);
    }
};

const getDepartmentById = async (req, res, next) => {
    try {
        const department = await departmentService.getDepartmentById(req.params.id);
        if (!department) {
            return errorResponse(res, 'Department not found', 'NOT_FOUND', 404);
        }
        return successResponse(res, department, 'Department fetched successfully');
    } catch (error) {
        next(error);
    }
};

const updateDepartment = async (req, res, next) => {
    try {
        const department = await departmentService.updateDepartment(req.params.id, req.body);
        return successResponse(res, department, 'Department updated successfully');
    } catch (error) {
        next(error);
    }
};

const deleteDepartment = async (req, res, next) => {
    try {
        await departmentService.deleteDepartment(req.params.id);
        return successResponse(res, null, 'Department deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};
