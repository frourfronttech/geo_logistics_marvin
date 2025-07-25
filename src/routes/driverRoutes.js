const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const driverController = require('../controllers/driverController');

router.patch('/availability', [auth, requireRole('driver')], driverController.toggleAvailability);

module.exports = router;
