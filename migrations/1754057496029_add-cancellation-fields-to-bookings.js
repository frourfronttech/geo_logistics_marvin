/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns('bookings', {
    canceled_at: {
      type: 'timestamp',
    },
    canceled_by: {
      type: 'varchar(10)',
      check: "canceled_by IN ('rider', 'driver')",
    },
    cancellation_reason: {
      type: 'text',
    },
  });
};

exports.down = pgm => {
  pgm.dropColumns('bookings', ['canceled_at', 'canceled_by', 'cancellation_reason']);
};
