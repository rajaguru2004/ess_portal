const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'ESS Portal API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

/**
 * API information endpoint
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to ESS Portal API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api/v1',
        },
    });
});

/**
 * API v1 routes
 * Add your route modules here
 */
router.use('/api/v1', (req, res, next) => {
    // Placeholder for v1 API routes
    // Example: router.use('/api/v1/auth', authRoutes);
    // Example: router.use('/api/v1/users', userRoutes);
    next();
});

// Example placeholder endpoint for API v1
router.get('/api/v1', (req, res) => {
    res.json({
        success: true,
        message: 'API v1 endpoint',
        availableRoutes: [
            // Add your routes here as you build them
            // '/api/v1/auth',
            // '/api/v1/users',
            // '/api/v1/attendance',
            // '/api/v1/leave',
        ],
    });
});

module.exports = router;
