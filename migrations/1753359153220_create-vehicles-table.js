/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('vehicles', {
    id: 'id',
    driver_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    make: { type: 'text', notNull: true },
    model: { type: 'text', notNull: true },
    year: { type: 'integer' },
    license_plate: { type: 'text', notNull: true, unique: true },
    fuel_type: { type: 'text', check: "fuel_type IN ('petrol', 'diesel')" },
    avg_fuel_consumption: { type: 'numeric' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('vehicles');
};
