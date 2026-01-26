const app = require('./app');
const { getPrismaClient, disconnectPrisma } = require('./Prisma/client');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Connect Database
        await getPrismaClient().$connect();
        console.log('✅ Database connected');

        // Start Server
        const server = app.listen(PORT, () => {
            console.log('');
            console.log('🚀 ======================================');
            console.log(`🚀 ESS Portal Backend Server`);
            console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🚀 Server running on port: ${PORT}`);
            console.log(`🚀 Health check: http://localhost:${PORT}/health`);
            console.log('🚀 ======================================');
            console.log('');
        });

        // Graceful Shutdown
        const shutdown = async () => {
            console.log('\n🛑 SIGTERM/SIGINT received. Shutting down...');
            if (server) {
                server.close(() => {
                    console.log('✅ HTTP server closed');
                });
            }
            await disconnectPrisma();
            process.exit(0);
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
