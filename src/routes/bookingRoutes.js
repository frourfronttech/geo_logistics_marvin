const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const bookingController = require('../controllers/bookingController');

// Rider routes
router.post('/', [auth, requireRole('rider')], bookingController.createBooking);
router.get('/', auth, bookingController.getPastBookings);

// Driver routes
router.get('/available', [auth, requireRole('driver')], bookingController.getAvailableBookings);
router.patch('/:id/accept', [auth, requireRole('driver')], bookingController.acceptBooking);
router.patch('/:id/start', [auth, requireRole('driver')], bookingController.startTrip);
router.patch('/:id/complete', [auth, requireRole('driver')], bookingController.completeTrip);

module.exports = router;
