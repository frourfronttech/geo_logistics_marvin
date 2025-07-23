const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const db = require('../db');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, user_type, full_name, phone_number } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password_hash, user_type, full_name, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, hashedPassword, user_type, full_name, phone_number]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already in use' });
    }
    next(err);
  }
};
