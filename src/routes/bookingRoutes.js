const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

module.exports = (io) => {
  const bookingController = require('../controllers/bookingController')(io);

  // Rider routes
  router.post('/', [auth, requireRole('rider')], bookingController.createBooking);
router.get('/mine', [auth, requireRole('rider')], bookingController.getMyBookings);
router.get('/', auth, bookingController.getPastBookings);
router.get('/:id', auth, bookingController.getBookingById);

// Driver routes
router.get('/available', [auth, requireRole('driver')], bookingController.getAvailableBookings);
router.patch('/:id/accept', [auth, requireRole('driver')], bookingController.acceptBooking);
router.patch('/:id/start', [auth, requireRole('driver')], bookingController.startTrip);
router.patch('/:id/complete', [auth, requireRole('driver')], bookingController.completeTrip);
router.post('/:id/cancel', auth, bookingController.cancelBooking);

  return router;
};
