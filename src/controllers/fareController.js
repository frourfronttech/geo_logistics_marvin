const db = require('../db');
const { getFuelPrice } = require('../services/fuelPriceService');

exports.estimateFare = async (req, res, next) => {
  const { vehicle_id, distance_km } = req.body;

  if (!vehicle_id || !distance_km) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // 1. Get vehicle's fuel consumption
    const vehicleResult = await db.query('SELECT avg_fuel_consumption, fuel_type FROM vehicles WHERE id = $1', [vehicle_id]);
    if (vehicleResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    const { avg_fuel_consumption, fuel_type } = vehicleResult.rows[0];

    if (!avg_fuel_consumption) {
      return res.status(400).json({ success: false, message: 'Vehicle does not have average fuel consumption set' });
    }

    // 2. Get real-time fuel price
    const fuelPricePerLiter = await getFuelPrice(fuel_type);

    // 3. Calculate fare
    // Formula: average fuel consumption = (fuel used / number of kilometers) x 100
    // So, fuel used = (average fuel consumption / 100) * number of kilometers
    const fuelUsedLiters = (avg_fuel_consumption / 100) * distance_km;
    const estimatedCost = fuelUsedLiters * fuelPricePerLiter;

    // Add a profit margin for the driver (e.g., 20%)
    const profitMargin = 1.20;
    const estimatedFare = estimatedCost * profitMargin;

    res.status(200).json({
      success: true,
      estimated_cost: estimatedCost.toFixed(2),
      suggested_fare: estimatedFare.toFixed(2),
      details: {
        distance_km,
        fuel_price_per_liter: fuelPricePerLiter,
        avg_fuel_consumption_l_100km: avg_fuel_consumption,
        fuel_used_liters: fuelUsedLiters.toFixed(2),
      }
    });

  } catch (err) {
    next(err);
  }
};
