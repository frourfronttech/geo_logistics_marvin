const driverLocations = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('locationUpdate', (data) => {
      const { driverId, lat, lng, bookingId } = data;
      if (!driverId || !lat || !lng) {
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
      // Optional: clean up driver location on disconnect
      // This would require mapping socket.id to driverId on connection
    });
  });
};
