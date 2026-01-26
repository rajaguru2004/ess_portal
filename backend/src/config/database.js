const { PrismaClient } = require('@prisma/client');

// Prisma Client singleton
let prisma;

/**
 * Get Prisma Client instance
 * Creates a singleton to avoid multiple instances
 */
const getPrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        });
    }
    return prisma;
};

/**
 * Connect to database
 */
const connectDatabase = async () => {
    try {
        const client = getPrismaClient();
        await client.$connect();
        console.log('✅ Database connected successfully');
        return client;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

/**
 * Disconnect from database
 */
const disconnectDatabase = async () => {
    try {
        if (prisma) {
            await prisma.$disconnect();
            console.log('✅ Database disconnected successfully');
        }
    } catch (error) {
        console.error('❌ Error disconnecting from database:', error);
    }
};

module.exports = {
    getPrismaClient,
    connectDatabase,
    disconnectDatabase,
};
