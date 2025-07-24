/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumn('users', {
    role: {
      type: 'varchar(10)',
      notNull: true,
      default: 'rider',
      check: "role IN ('rider', 'driver')",
    },
  });
};

exports.down = pgm => {
  pgm.dropColumn('users', 'role');
};
