const db = require('../db');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinBookingRoom', async (bookingId) => {
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
  });
};
