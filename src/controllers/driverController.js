const db = require('../db');

exports.toggleAvailability = async (req, res, next) => {
  const driver_id = req.user.id;
  const { is_available } = req.body;

  if (typeof is_available !== 'boolean') {
    return res.status(400).json({ success: false, message: 'is_available must be a boolean' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET is_available = $1 WHERE id = $2 AND user_type = \'driver\' RETURNING id, is_available',
      [is_available, driver_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.status(200).json({ success: true, driver: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getAvailableDrivers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, full_name, phone_number FROM users WHERE user_type = \'driver\' AND is_available = true');
    res.status(200).json({ success: true, drivers: result.rows });
  } catch (err) {
    next(err);
  }
};
