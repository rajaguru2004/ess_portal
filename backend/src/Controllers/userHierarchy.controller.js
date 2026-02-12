const userHierarchyService = require('../Services/userHierarchy.service');
const { successResponse, errorResponse } = require('../Utils/response');

const getAllManagers = async (req, res, next) => {
    try {
        const managers = await userHierarchyService.getAllManagers();
        return successResponse(res, managers, 'Managers retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * User Hierarchy Controller
 * Handles manager assignment and hierarchy operations
 */

/**
 * Make an employee a manager
 * PATCH /api/v1/users/:id/make-manager
 */
const makeManager = async (req, res, next) => {
    try {
        const headId = req.user.userId;
        const { id: employeeId } = req.params;

        const updatedUser = await userHierarchyService.makeManager(headId, employeeId);

        return successResponse(
            res,
            updatedUser,
            'Manager role assigned successfully',
            200
        );
    } catch (error) {
        // Handle business logic errors
        if (
            error.message.includes('not found') ||
            error.message.includes('Only head managers') ||
            error.message.includes('same tenant') ||
            error.message.includes('same department') ||
            error.message.includes('already a')
        ) {
            return errorResponse(res, error.message, 'HIERARCHY_ERROR', 400);
        }
        next(error);
    }
};

const makeHeadManager = async (req, res, next) => {
    try {
        const { id: employeeId } = req.params;

        const updatedUser = await userHierarchyService.makeHeadManager(employeeId);

        return successResponse(
            res,
            updatedUser,
            'Promoted to Head Manager successfully',
            200
        );
    } catch (error) {
        if (error.message.includes('not found')) {
            return errorResponse(res, error.message, 'HIERARCHY_ERROR', 400);
        }
        next(error);
    }
};

/**
 * Assign an employee to a manager
 * PATCH /api/v1/users/:employeeId/assign-manager
 */
const assignEmployeeToManager = async (req, res, next) => {
    try {
        const headId = req.user.userId;
        const { employeeId } = req.params;
        const { managerId } = req.body;

        if (!managerId) {
            return errorResponse(res, 'Manager ID is required', 'VALIDATION_ERROR', 400);
        }

        const updatedEmployee = await userHierarchyService.assignEmployeeToManager(
            headId,
            employeeId,
            managerId
        );

        return successResponse(
            res,
            updatedEmployee,
            'Employee assigned to manager successfully',
            200
        );
    } catch (error) {
        // Handle business logic errors
        if (
            error.message.includes('not found') ||
            error.message.includes('Only head managers') ||
            error.message.includes('same tenant') ||
            error.message.includes('same department') ||
            error.message.includes('themselves') ||
            error.message.includes('circular hierarchy')
        ) {
            return errorResponse(res, error.message, 'HIERARCHY_ERROR', 400);
        }
        next(error);
    }
};

/**
 * Get user hierarchy
 * GET /api/v1/users/:id/hierarchy
 */
const getHierarchy = async (req, res, next) => {
    try {
        const { id: userId } = req.params;

        const hierarchy = await userHierarchyService.getHierarchy(userId);

        return successResponse(res, hierarchy, 'Hierarchy retrieved successfully');
    } catch (error) {
        if (error.message.includes('not found')) {
            return errorResponse(res, error.message, 'USER_NOT_FOUND', 404);
        }
        next(error);
    }
};

module.exports = {
    makeManager,
    makeHeadManager,
    assignEmployeeToManager,
    getHierarchy,
    getAllManagers
};
