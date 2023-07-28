const express = require('express');
const { LineitemsController } = require('../controllers');

const router = express.Router();

router.post('/create', LineitemsController.createLineItems);
module.exports = router;
