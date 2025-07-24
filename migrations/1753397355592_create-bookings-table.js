/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('bookings', {
    id: 'id',
    rider_id: { type: 'integer', notNull: true, references: 'users(id)' },
    driver_id: { type: 'integer', references: 'users(id)' },
    vehicle_id: { type: 'integer', references: 'vehicles(id)' },
    pickup_location: { type: 'text', notNull: true },
    dropoff_location: { type: 'text', notNull: true },
    distance: { type: 'numeric', notNull: true },
    estimated_fare: { type: 'numeric', notNull: true },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'pending',
      check: "status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')",
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('bookings');
};
