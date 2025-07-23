/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addIndex('users', 'email');
};

exports.down = pgm => {
  pgm.dropIndex('users', 'email');
};
