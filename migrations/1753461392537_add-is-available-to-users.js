/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumn('users', {
    is_available: {
      type: 'boolean',
      default: false,
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropColumn('users', 'is_available');
};
