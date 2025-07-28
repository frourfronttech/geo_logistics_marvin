const db = require('../db');

const findBestDriver = async (booking) => {
  try {
    // For now, we'll implement a simple matching algorithm:
    // 1. Find all available drivers.
    // 2. For simplicity, we'll just pick the first available driver.
    // In a real app, you would use a more complex algorithm involving location,
    // driver rating, vehicle type, etc.

    const availableDriversResult = await db.query(
      "SELECT id FROM users WHERE role = 'driver' AND is_available = true"
    );

    if (availableDriversResult.rows.length === 0) {
      return null; // No available drivers
    }

    // Simple matching: return the first available driver
    const bestDriver = availableDriversResult.rows[0];
    return bestDriver;

  } catch (error) {
    console.error('Error in findBestDriver:', error);
    return null;
  }
};

module.exports = {
  findBestDriver,
};
