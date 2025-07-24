const axios = require('axios');

const getFuelPrice = async (fuelType) => {
  try {
    // In a real app, you would make a call to a fuel price API
    // For this example, we'll use a mock implementation
    const mockPrices = {
      petrol: 1.5,
      diesel: 1.4,
    };
    return mockPrices[fuelType] || 1.6; // Default price
  } catch (error) {
    console.error('Error fetching fuel price:', error);
    // Return a default/fallback price in case of an error
    return 1.6;
  }
};

module.exports = {
  getFuelPrice,
};
