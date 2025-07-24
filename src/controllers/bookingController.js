const db = require('../db');

exports.createBooking = async (req, res, next) => {
  const { pickup_location, dropoff_location, distance, estimated_fare } = req.body;
  const rider_id = req.user.id;

  if (!pickup_location || !dropoff_location || !distance || !estimated_fare) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const result = await db.query(
      'INSERT INTO bookings (rider_id, pickup_location, dropoff_location, distance, estimated_fare) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [rider_id, pickup_location, dropoff_location, distance, estimated_fare]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.getAvailableBookings = async (req, res, next) => {
  // To be implemented
  res.status(200).json({ success: true, message: 'Available bookings placeholder' });
};

exports.acceptBooking = async (req, res, next) => {
  // To be implemented
  res.status(200).json({ success: true, message: 'Accept booking placeholder' });
};

exports.startTrip = async (req, res, next) => {
  // To be implemented
  res.status(200).json({ success: true, message: 'Start trip placeholder' });
};

exports.completeTrip = async (req, res, next) => {
  // To be implemented
  res.status(200).json({ success: true, message: 'Complete trip placeholder' });
};

exports.getPastBookings = async (req, res, next) => {
  // To be implemented
  res.status(200).json({ success: true, message: 'Past bookings placeholder' });
};
