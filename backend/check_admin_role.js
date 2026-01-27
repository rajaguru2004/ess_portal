const { prisma } = require('./src/Prisma/client');

async function check() {
    try {
        const user = await prisma.user.findUnique({
            where: { username: 'admin' },
            include: { Role: true }
        });
        console.log('Direct DB Check - User:', JSON.stringify(user, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
