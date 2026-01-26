const { PrismaClient } = require('@prisma/client');

/**
 * Prisma Client Singleton
 * Ensures only one instance of Prisma Client exists throughout the application
 */

let prisma;

/**
 * Get Prisma Client instance
 * @returns {PrismaClient} Prisma Client instance
 */
const getPrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
    }
    return prisma;
};

/**
 * Disconnect Prisma Client
 */
const disconnectPrisma = async () => {
    if (prisma) {
        await prisma.$disconnect();
        console.log('✅ Prisma Client disconnected');
    }
};

module.exports = {
    getPrismaClient,
    disconnectPrisma,
    prisma: getPrismaClient(),
};
