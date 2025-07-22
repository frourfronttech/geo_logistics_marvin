/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    full_name: { type: 'varchar(255)' },
    phone_number: { type: 'varchar(50)' },
    user_type: { type: 'varchar(10)', notNull: true, check: "user_type IN ('rider', 'driver')" },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('vehicles', {
    id: 'id',
    driver_id: { type: 'integer', notNull: true, references: 'users(id)' },
    make: { type: 'varchar(100)', notNull: true },
    model: { type: 'varchar(100)', notNull: true },
    year: { type: 'integer', notNull: true },
    license_plate: { type: 'varchar(20)', notNull: true, unique: true },
    fuel_type: { type: 'varchar(20)', notNull: true },
    average_fuel_consumption: { type: 'decimal(5, 2)' },
  });

  pgm.createTable('locations', {
    id: 'id',
    latitude: { type: 'decimal(9, 6)', notNull: true },
    longitude: { type: 'decimal(9, 6)', notNull: true },
    address_line1: { type: 'varchar(255)' },
    city: { type: 'varchar(100)' },
    postal_code: { type: 'varchar(20)' },
  });

  pgm.createTable('rides', {
    id: 'id',
    rider_id: { type: 'integer', notNull: true, references: 'users(id)' },
    driver_id: { type: 'integer', references: 'users(id)' },
    pickup_location_id: { type: 'integer', notNull: true, references: 'locations(id)' },
    destination_location_id: { type: 'integer', notNull: true, references: 'locations(id)' },
    status: { type: 'varchar(20)', notNull: true, default: 'requested', check: "status IN ('requested', 'accepted', 'in_progress', 'completed', 'cancelled')" },
    suggested_fare: { type: 'decimal(10, 2)' },
    final_fare: { type: 'decimal(10, 2)' },
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

  pgm.createTable('fuel_prices', {
    id: 'id',
    fuel_type: { type: 'varchar(20)', notNull: true },
    price_per_liter: { type: 'decimal(10, 2)', notNull: true },
    city: { type: 'varchar(100)' },
    last_updated: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('fuel_prices');
  pgm.dropTable('rides');
  pgm.dropTable('locations');
  pgm.dropTable('vehicles');
  pgm.dropTable('users');
};
