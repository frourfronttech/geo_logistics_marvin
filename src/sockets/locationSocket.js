const driverLocations = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    if (socket.user.role !== 'driver') {
      return;
    }

    socket.on('locationUpdate', (data) => {
      const { lat, lng, bookingId } = data;
      const driverId = socket.user.id;
      if (!lat || !lng) {
        return;
      }
      driverLocations.set(driverId, { lat, lng, timestamp: Date.now() });

      if (bookingId) {
        socket.to(`booking-${bookingId}`).emit('driverLocation', { driverId, lat, lng });
      }
    });

    socket.on('joinBookingRoom', ({ bookingId }) => {
      socket.join(`booking-${bookingId}`);
      console.log(`Socket ${socket.id} joined room booking-${bookingId}`);
    });

    socket.on('disconnect', () => {
      const driverId = socket.user.id;
      if (driverId) {
        driverLocations.delete(driverId);
      }
    });
  });
};
