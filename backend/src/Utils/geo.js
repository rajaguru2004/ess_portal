/**
 * Geo-fencing Utility Functions
 * Calculates distances between GPS coordinates using the Haversine formula
 */

/**
 * Calculate distance between two GPS coordinates in meters
 * Uses the Haversine formula for great-circle distance
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in meters
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

/**
 * Check if user's location is within allowed geo-fence
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {boolean} True if within fence, false otherwise
 */
const isWithinGeoFence = (userLat, userLon) => {
    const officeLat = parseFloat(process.env.OFFICE_LATITUDE);
    const officeLon = parseFloat(process.env.OFFICE_LONGITUDE);
    const maxRadius = parseFloat(process.env.GEO_FENCE_RADIUS_METERS);

    if (isNaN(officeLat) || isNaN(officeLon) || isNaN(maxRadius)) {
        console.warn('Geo-fence configuration missing. Skipping validation.');
        return true; // Default to true if config is missing
    }

    const distance = calculateDistance(userLat, userLon, officeLat, officeLon);
    return distance <= maxRadius;
};

module.exports = {
    calculateDistance,
    isWithinGeoFence,
};
