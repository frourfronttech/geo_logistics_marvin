/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns('bookings', {
    started_at: {
      type: 'timestamp',
    },
    completed_at: {
      type: 'timestamp',
    },
  });
};

exports.down = pgm => {
  pgm.dropColumns('bookings', ['started_at', 'completed_at']);
};
