const { prisma } = require('../Prisma/client');
const { uploadToMinio } = require('../Middlewares/upload.middleware');
const { isWithinGeoFence } = require('../Utils/geo');
const { getCurrentDate, calculateWorkMinutes, isLate } = require('../Utils/time');

/**
 * Attendance Service
 * Contains all business logic for punch-in and punch-out operations
 */

/**
 * Check if today is a holiday
 * @param {Date} date - Date to check
 * @param {string} tenantId - Tenant ID
 * @param {string} branchId - Branch ID
 * @returns {Promise<boolean>}
 */
const checkIfHoliday = async (date, tenantId, branchId) => {
    const holiday = await prisma.holiday.findFirst({
        where: {
            date: new Date(date),
            OR: [
                { tenantId, branchId, type: 'LOCATION' },
                { tenantId, type: 'ORGANIZATION' },
            ],
        },
    });
    return !!holiday;
};

/**
 * Punch In (Check-In) Service
 * @param {string} userId - User ID from JWT
 * @param {Object} photo - Photo file from Multer
 * @param {string} latitude - User's latitude
 * @param {string} longitude - User's longitude
 * @param {string} deviceInfo - Optional device information
 * @param {string} ipAddress - Client IP address
 * @returns {Promise<Object>} Attendance data
 */
const checkIn = async (userId, photo, latitude, longitude, deviceInfo, ipAddress) => {
    // 1. Validate photo is present
    if (!photo) {
        throw new Error('Photo is required');
    }

    // 2. Get current date (server time)
    const currentDate = getCurrentDate();
    const now = new Date();

    // 3. Check if attendance already exists for today
    // ⚠️ DISABLED FOR TESTING - Normally prevents multiple check-ins per day
    /*
    const existingAttendance = await prisma.attendance.findUnique({
        where: {
            userId_date: {
                userId,
                date: new Date(currentDate),
            },
        },
    });

    // 4. Reject if already checked in
    if (existingAttendance && existingAttendance.status !== 'PENDING') {
        throw new Error('Already checked in');
    }
    */

    // 5. Upload photo to MinIO
    const fileName = `attendance/${userId}/${currentDate}/checkin-${Date.now()}.${photo.mimetype.split('/')[1]}`;
    const photoUrl = await uploadToMinio(photo.buffer, fileName, photo.mimetype);

    // 6. Fetch user details (for shift and tenant info)
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { tenantId: true, branchId: true },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // 6.5. Check if user is on approved leave
    const approvedLeave = await prisma.leaveApplication.findFirst({
        where: {
            userId,
            status: 'APPROVED',
            startDate: { lte: new Date(currentDate) },
            endDate: { gte: new Date(currentDate) }
        }
    });

    if (approvedLeave) {
        throw new Error('Cannot punch in. You are on approved leave.');
    }

    // 7. Fetch user's shift (optional - allow if not assigned)
    let shift = null;
    let shiftId = null;
    let late = false;

    try {
        // In a real system, you'd fetch shift assignment for the user
        // For now, we'll skip this as shift assignment table doesn't exist
        // shift = await getShiftForUser(userId, currentDate);
    } catch (error) {
        console.warn('Shift fetch failed:', error.message);
    }

    // 8. Check if shift start time has passed (mark late if applicable)
    if (shift) {
        shiftId = shift.id;
        late = isLate(now, shift.startTime, shift.graceMinutes || 0);
    }

    // 9. Validate geo-fence
    const geoMismatch = !isWithinGeoFence(parseFloat(latitude), parseFloat(longitude));

    // 10. Create Attendance record (TESTING MODE - allows multiple per day)
    const attendance = await prisma.attendance.create({
        data: {
            userId,
            date: new Date(currentDate),
            shiftId,
            checkInAt: now,
            status: 'CHECKED_IN',
            isLate: late,
            geoMismatch,
        },
    });

    // 11. Create AttendanceLog (audit trail)
    await prisma.attendanceLog.create({
        data: {
            attendanceId: attendance.id,
            type: 'IN',
            timestamp: now,
            latitude,
            longitude,
            photoUrl,
            deviceInfo,
            ipAddress,
        },
    });

    // 12. Return response data
    return {
        attendanceId: attendance.id,
        status: attendance.status,
        checkInAt: attendance.checkInAt,
        isLate: attendance.isLate,
        geoMismatch: attendance.geoMismatch,
    };
};

/**
 * Punch Out (Check-Out) Service
 * @param {string} userId - User ID from JWT
 * @param {string} latitude - User's latitude
 * @param {string} longitude - User's longitude
 * @param {Object} photo - Optional photo file from Multer
 * @param {string} deviceInfo - Optional device information
 * @param {string} ipAddress - Client IP address
 * @returns {Promise<Object>} Attendance data
 */
const checkOut = async (userId, latitude, longitude, photo, deviceInfo, ipAddress) => {
    // 1. Get current date
    const currentDate = getCurrentDate();
    const now = new Date();

    // 2. Find today's attendance record (TESTING MODE - Find latest record)
    // ⚠️ DISABLED STRICT VALIDATION FOR TESTING
    /*
    const attendance = await prisma.attendance.findUnique({
        where: {
            userId_date: {
                userId,
                date: new Date(currentDate),
            },
        },
    });

    // 3. Reject if no check-in exists
    if (!attendance) {
        throw new Error('Punch-in required');
    }

    // 4. Reject if already checked out
    if (attendance.status === 'CHECKED_OUT') {
        throw new Error('Already checked out');
    }
    */

    // TESTING MODE: Find the most recent check-in for today
    const attendance = await prisma.attendance.findFirst({
        where: {
            userId,
            date: new Date(currentDate),
            status: 'CHECKED_IN',
        },
        orderBy: {
            checkInAt: 'desc',
        },
    });

    if (!attendance) {
        throw new Error('Punch-in required');
    }

    // 5. Upload photo to MinIO if provided
    let photoUrl = null;
    if (photo) {
        const fileName = `attendance/${userId}/${currentDate}/checkout-${Date.now()}.${photo.mimetype.split('/')[1]}`;
        photoUrl = await uploadToMinio(photo.buffer, fileName, photo.mimetype);
    }

    // 6. Calculate work duration
    const workMinutes = calculateWorkMinutes(attendance.checkInAt, now);

    // 7. Update Attendance record
    const updatedAttendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
            checkOutAt: now,
            status: 'CHECKED_OUT',
            workMinutes,
        },
    });

    // 8. Create AttendanceLog (audit trail)
    await prisma.attendanceLog.create({
        data: {
            attendanceId: attendance.id,
            type: 'OUT',
            timestamp: now,
            latitude,
            longitude,
            photoUrl,
            deviceInfo,
            ipAddress,
        },
    });

    // 9. Return response data
    return {
        attendanceId: updatedAttendance.id,
        status: updatedAttendance.status,
        checkOutAt: updatedAttendance.checkOutAt,
        workMinutes: updatedAttendance.workMinutes,
    };
};

/**
 * Get Attendance Logs with Photos
 * @param {string} userId - User ID from JWT
 * @param {string} startDate - Optional start date (YYYY-MM-DD)
 * @param {string} endDate - Optional end date (YYYY-MM-DD)
 * @returns {Promise<Array>} Attendance logs with photo URLs
 */
const getAttendanceLogs = async (userId, startDate, endDate) => {
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
        dateFilter.date = {};
        if (startDate) {
            dateFilter.date.gte = new Date(startDate);
        }
        if (endDate) {
            dateFilter.date.lte = new Date(endDate);
        }
    }

    // Fetch attendance records with logs
    const attendanceRecords = await prisma.attendance.findMany({
        where: {
            userId,
            ...dateFilter,
        },
        include: {
            logs: {
                orderBy: {
                    timestamp: 'asc',
                },
            },
        },
        orderBy: {
            date: 'desc',
        },
    });

    return attendanceRecords;
};

module.exports = {
    checkIn,
    checkOut,
    getAttendanceLogs,
};
