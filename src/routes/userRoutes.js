const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Placeholder for user registration
router.post('/register', userController.register);

module.exports = router;
