const express = require('express');
const { APILocationController } = require('../controllers');
const router = express.Router();

router.get('/getToken', APILocationController.getToken);
router.get('/getCountries', APILocationController.getCountries);
router.post('/getStates', APILocationController.getStates);
router.post('/getCities', APILocationController.getCities);

module.exports = router;
