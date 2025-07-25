/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumn('bookings', {
    accepted_at: {
      type: 'timestamp',
    },
  });
};

exports.down = pgm => {
  pgm.dropColumn('bookings', 'accepted_at');
};
