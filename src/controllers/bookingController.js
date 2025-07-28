const db = require('../db');
const autoMatchingService = require('../services/autoMatchingService');

module.exports = (io) => {
  const exports = {};

  exports.createBooking = async (req, res, next) => {
    const { pickup_location, dropoff_location, distance, estimated_fare } = req.body;
    const rider_id = req.user.id;

    if (!pickup_location || !dropoff_location || !distance || !estimated_fare) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
      const newBookingResult = await db.query(
        'INSERT INTO bookings (rider_id, pickup_location, dropoff_location, distance, estimated_fare) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [rider_id, pickup_location, dropoff_location, distance, estimated_fare]
      );
      const newBooking = newBookingResult.rows[0];

      const bestDriver = await autoMatchingService.findBestDriver(newBooking);

      if (bestDriver) {
        await db.query(
          "UPDATE bookings SET driver_id = $1, status = 'accepted', accepted_at = NOW() WHERE id = $2",
          [bestDriver.id, newBooking.id]
        );
        newBooking.driver_id = bestDriver.id;
        newBooking.status = 'accepted';
        io.to(`booking-${newBooking.id}`).emit('bookingStatusUpdate', {
          bookingId: newBooking.id,
          status: 'accepted',
          driverId: bestDriver.id,
        });
      } else {
        io.emit('newBooking', newBooking);
      }

      res.status(201).json(newBooking);
    } catch (err) {
      next(err);
    }
  };

  return exports;
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

    const updatedBooking = result.rows[0];
    io.to(`booking-${id}`).emit('bookingStatusUpdate', {
      bookingId: id,
      status: 'accepted',
      driverId: driver_id,
    });
    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

exports.startTrip = async (req, res, next) => {
  const { id } = req.params;
  const driver_id = req.user.id;

  try {
    const bookingResult = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];
    if (booking.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Booking cannot be started' });
    }

    if (booking.driver_id !== driver_id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to start this trip' });
    }

    const result = await db.query(
      "UPDATE bookings SET status = 'in_progress', started_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );

    const updatedBooking = result.rows[0];
    io.to(`booking-${id}`).emit('bookingStatusUpdate', {
      bookingId: id,
      status: 'in_progress',
    });
    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

exports.completeTrip = async (req, res, next) => {
  const { id } = req.params;
  const driver_id = req.user.id;

  try {
    const bookingResult = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];
    if (booking.status !== 'in_progress') {
      return res.status(400).json({ success: false, message: 'Booking cannot be completed' });
    }

    if (booking.driver_id !== driver_id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to complete this trip' });
    }

    const result = await db.query(
      "UPDATE bookings SET status = 'completed', completed_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );

    const updatedBooking = result.rows[0];
    io.to(`booking-${id}`).emit('bookingStatusUpdate', {
      bookingId: id,
      status: 'completed',
    });
    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

exports.getMyBookings = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const bookings = await db.query(
      `SELECT b.*, u.full_name AS driver_name, v.make AS vehicle_make, v.model AS vehicle_model
       FROM bookings b
       LEFT JOIN users u ON b.driver_id = u.id
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       WHERE b.rider_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );
    res.json({ bookings: bookings.rows });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const result = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    const booking = result.rows[0];
    if (userRole === 'rider' && booking.rider_id !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    if (userRole === 'driver' && booking.driver_id !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.getPastBookings = async (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let query;
    if (userRole === 'driver') {
      query = 'SELECT * FROM bookings WHERE driver_id = $1 ORDER BY created_at DESC';
    } else {
      query = 'SELECT * FROM bookings WHERE rider_id = $1 ORDER BY created_at DESC';
    }
    const result = await db.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};
