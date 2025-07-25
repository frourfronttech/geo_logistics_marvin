const db = require('../db');

exports.toggleAvailability = async (req, res, next) => {
  const driver_id = req.user.id;
  const { is_available } = req.body;

  if (typeof is_available !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Invalid is_available value' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET is_available = $1 WHERE id = $2 AND role = \'driver\' RETURNING id, email, is_available',
      [is_available, driver_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
