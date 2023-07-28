const express = require('express');
const { OwnerController } = require('../controllers');
const router = express.Router();

router.post('/get', OwnerController.getOwner);

module.exports = router;
