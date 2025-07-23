const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('user_type')
      .isIn(['rider', 'driver'])
      .withMessage('Invalid user type'),
  ],
  userController.register
);

router.post('/login', userController.login);

router.get('/me', auth, async (req, res) => {
  try {
    const db = require('../db');
    const userQuery = await db.query('SELECT id, email, user_type FROM users WHERE id = $1', [
      req.user.id,
    ]);
    res.status(200).json(userQuery.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user info' });
  }
});

module.exports = router;
