const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vehicleController = require('../controllers/vehicleController');

router.post('/', auth, vehicleController.createVehicle);
router.get('/', auth, vehicleController.getVehiclesByDriver);
router.put('/:id', auth, vehicleController.updateVehicle);
router.delete('/:id', auth, vehicleController.deleteVehicle);

module.exports = router;
