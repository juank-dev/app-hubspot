const express = require('express');
const { RegisterController } = require('../controllers');
const router = express.Router();

router.post('/save', RegisterController.saveUser);
router.get('/get/:portal_id', RegisterController.getUser);

module.exports = router;
