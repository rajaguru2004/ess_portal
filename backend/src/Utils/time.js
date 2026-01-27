/**
 * Time Utility Functions
 * Handles date/time operations for attendance system
 */

/**
 * Get current date in YYYY-MM-DD format (server time)
 * @returns {string} Current date
 */
const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Calculate work duration in minutes
 * @param {Date} checkInAt - Check-in timestamp
 * @param {Date} checkOutAt - Check-out timestamp
 * @returns {number} Work duration in minutes
 */
const calculateWorkMinutes = (checkInAt, checkOutAt) => {
    if (!checkInAt || !checkOutAt) return 0;

    const checkIn = new Date(checkInAt);
    const checkOut = new Date(checkOutAt);

    const diffMs = checkOut - checkIn;
    return Math.floor(diffMs / 1000 / 60); // Convert to minutes
};

/**
 * Check if check-in is late based on shift timing
 * @param {Date} checkInTime - Actual check-in time
 * @param {Date} shiftStartTime - Shift start time
 * @param {number} graceMinutes - Grace period in minutes
 * @returns {boolean} True if late, false otherwise
 */
const isLate = (checkInTime, shiftStartTime, graceMinutes = 0) => {
    if (!checkInTime || !shiftStartTime) return false;

    const checkIn = new Date(checkInTime);
    const shiftStart = new Date(shiftStartTime);

    // Add grace period to shift start time
    const allowedTime = new Date(shiftStart.getTime() + graceMinutes * 60000);

    return checkIn > allowedTime;
};

module.exports = {
    getCurrentDate,
    calculateWorkMinutes,
    isLate,
};
