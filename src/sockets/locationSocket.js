const driverLocations = new Map();

const db = require('../db');
const driverLocations = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('locationUpdate', (data) => {
      if (socket.user.role !== 'driver') return;
      const { lat, lng, bookingId } = data;
      const driverId = socket.user.id;
      if (!lat || !lng) {
        return;
      }
      driverLocations.set(driverId, { lat, lng, timestamp: Date.now() });

      if (bookingId) {
        io.to(`booking-${bookingId}`).emit('driverLocation', { driverId, lat, lng });
      }
    });

    socket.on('joinBookingRoom', async ({ bookingId }) => {
      try {
        const bookingResult = await db.query('SELECT rider_id, driver_id FROM bookings WHERE id = $1', [bookingId]);
        if (bookingResult.rows.length === 0) {
          return;
        }
        const booking = bookingResult.rows[0];
        if (socket.user.id === booking.rider_id || socket.user.id === booking.driver_id) {
          socket.join(`booking-${bookingId}`);
          console.log(`Socket ${socket.id} joined room booking-${bookingId}`);
        }
      } catch (error) {
        console.error('Error joining booking room:', error);
      }
    });

    socket.on('disconnect', () => {
      if (socket.user.role === 'driver') {
        const driverId = socket.user.id;
        if (driverId) {
          driverLocations.delete(driverId);
        }
      }
    });
  });
};
