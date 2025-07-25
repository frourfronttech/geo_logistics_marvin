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
  try {
    const result = await db.query("SELECT * FROM bookings WHERE status = 'pending'");
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.acceptBooking = async (req, res, next) => {
  const { id } = req.params;
  const driver_id = req.user.id;

  try {
    const bookingResult = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];
    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Booking is not available for acceptance' });
    }

    const result = await db.query(
      "UPDATE bookings SET status = 'accepted', driver_id = $1, accepted_at = NOW() WHERE id = $2 AND status = 'pending' RETURNING *",
      [driver_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ success: false, message: 'Booking was already accepted by another driver' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
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
