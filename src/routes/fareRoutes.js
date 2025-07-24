const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fareController = require('../controllers/fareController');

router.post('/estimate', auth, fareController.estimateFare);

module.exports = router;
