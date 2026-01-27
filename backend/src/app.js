const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./Routes/auth.routes');
const userRoutes = require('./Routes/user.routes');
const roleRoutes = require('./Routes/role.routes');
const departmentRoutes = require('./Routes/department.routes');
const shiftRoutes = require('./Routes/shift.routes');
const leaveTypeRoutes = require('./Routes/leaveType.routes');
const roleLeavePolicyRoutes = require('./Routes/roleLeavePolicy.routes');
const holidayRoutes = require('./Routes/holiday.routes');
const designationRoutes = require('./Routes/designation.routes');
const { errorHandler } = require('./Middlewares/error.middleware');
const { errorResponse } = require('./Utils/response');

const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Dev)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/shifts', shiftRoutes);
app.use('/api/v1/leave-types', leaveTypeRoutes);
app.use('/api/v1/role-leave-policies', roleLeavePolicyRoutes);
app.use('/api/v1/holidays', holidayRoutes);
app.use('/api/v1/designations', designationRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// 404 Handler
app.use((req, res, next) => {
    errorResponse(res, 'Route not found', 'ERR_NOT_FOUND', 404);
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
