const { prisma } = require('./src/Prisma/client');
const { createShiftAssignment } = require('./src/Services/shiftAssignment.service');
const { format } = require('date-fns');

async function testMultipleShifts() {
    console.log('--- Verifying Multiple Shifts ---');
    try {
        // 1. Get a user
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('No users found. Skipping test.');
            return;
        }
        console.log(`User: ${user.fullName} (${user.id})`);

        // 2. Get two different shifts (or create if needed, but let's assume we have some)
        const shifts = await prisma.shift.findMany({ take: 2 });
        if (shifts.length < 2) {
            // Create a dummy second shift if only 1 exists
            if (shifts.length === 1) {
                console.log('Creating a second dummy shift...');
                const secondShift = await prisma.shift.create({
                    data: {
                        tenantId: shifts[0].tenantId,
                        name: 'Check Shift 2',
                        code: 'CHK2',
                        startTime: new Date(),
                        endTime: new Date(),
                        isActive: true
                    }
                });
                shifts.push(secondShift);
            } else {
                console.log('Not enough shifts found. Skipping.');
                return;
            }
        }

        const shift1 = shifts[0];
        const shift2 = shifts[1];
        console.log(`Shift 1: ${shift1.name} (${shift1.id})`);
        console.log(`Shift 2: ${shift2.name} (${shift2.id})`);

        const today = format(new Date(), 'yyyy-MM-dd');

        // 3. Assign Shift 1
        console.log(`Assigning Shift 1 for ${today}...`);
        try {
            await createShiftAssignment({ userId: user.id, shiftId: shift1.id, date: today }, 'SYSTEM_TEST');
            console.log('✅ Shift 1 assigned.');
        } catch (e) {
            console.log('Info: Shift 1 likely already exists or failed:', e.message);
        }

        // 4. Assign Shift 2 (Same User, Same Day, Different Shift)
        console.log(`Assigning Shift 2 for ${today}...`);
        try {
            await createShiftAssignment({ userId: user.id, shiftId: shift2.id, date: today }, 'SYSTEM_TEST');
            console.log('✅ Shift 2 assigned successfully!');
        } catch (e) {
            console.error('❌ Failed to assign Shift 2:', e.message);
        }

        // 5. Try Assigning Shift 1 AGAIN (Should fail)
        console.log(`Assigning Shift 1 AGAIN for ${today}...`);
        try {
            await createShiftAssignment({ userId: user.id, shiftId: shift1.id, date: today }, 'SYSTEM_TEST');
            console.error('❌ Error: Duplicate specific shift was allowed!');
        } catch (e) {
            console.log('✅ Correctly blocked duplicate specific shift:', e.message);
        }

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testMultipleShifts();
