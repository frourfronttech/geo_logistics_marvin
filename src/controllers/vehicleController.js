const db = require('../db');

exports.createVehicle = async (req, res, next) => {
  const { make, model, year, license_plate, fuel_type, avg_fuel_consumption } = req.body;
  const driver_id = req.user.id;

  try {
    const result = await db.query(
      'INSERT INTO vehicles (driver_id, make, model, year, license_plate, fuel_type, avg_fuel_consumption) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [driver_id, make, model, year, license_plate, fuel_type, avg_fuel_consumption]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.getVehiclesByDriver = async (req, res, next) => {
  const driver_id = req.user.id;

  try {
    const result = await db.query('SELECT * FROM vehicles WHERE driver_id = $1', [driver_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.updateVehicle = async (req, res, next) => {
  const { id } = req.params;
  const { make, model, year, license_plate, fuel_type, avg_fuel_consumption } = req.body;
  const driver_id = req.user.id;

  try {
    const result = await db.query(
      'UPDATE vehicles SET make = $1, model = $2, year = $3, license_plate = $4, fuel_type = $5, avg_fuel_consumption = $6 WHERE id = $7 AND driver_id = $8 RETURNING *',
      [make, model, year, license_plate, fuel_type, avg_fuel_consumption, id, driver_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found or not owned by driver' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  const { id } = req.params;
  const driver_id = req.user.id;

  try {
    const result = await db.query('DELETE FROM vehicles WHERE id = $1 AND driver_id = $2 RETURNING *', [id, driver_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found or not owned by driver' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
