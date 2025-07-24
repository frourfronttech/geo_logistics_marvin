const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const vehicleController = require('../controllers/vehicleController');

router.post('/', [auth, requireRole('driver')], vehicleController.createVehicle);
router.get('/', auth, vehicleController.getVehiclesByDriver);
router.put('/:id', [auth, requireRole('driver')], vehicleController.updateVehicle);
router.delete('/:id', [auth, requireRole('driver')], vehicleController.deleteVehicle);

module.exports = router;
