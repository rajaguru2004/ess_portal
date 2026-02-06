const { prisma } = require('./src/Prisma/client');
const { createShiftAssignment } = require('./src/Services/shiftAssignment.service');
const { format, addDays } = require('date-fns');

async function testDateRangeShifts() {
    console.log('--- Verifying Date Range Shifts ---');
    try {
        const user = await prisma.user.findFirst();
        const shift = await prisma.shift.findFirst();

        if (!user || !shift) {
            console.log('Missing user or shift. Skipping.');
            return;
        }

        const startDate = format(new Date(), 'yyyy-MM-dd');
        const endDate = format(addDays(new Date(), 2), 'yyyy-MM-dd'); // 3 days total

        console.log(`Assigning shift ${shift.name} to ${user.fullName} from ${startDate} to ${endDate}`);

        const result = await createShiftAssignment({
            userId: user.id,
            shiftId: shift.id,
            startDate,
            endDate
        }, 'SYSTEM_TEST_RANGE');

        console.log('Result:', JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDateRangeShifts();
