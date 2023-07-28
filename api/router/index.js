const express = require('express');
const router = express.Router();

router.use('/contact', require('./contact'));
router.use('/product', require('./product'));
router.use('/register', require('./register'));
router.use('/location', require('./location'));
router.use('/deal', require('./deal'));
router.use('/pipeline', require('./pipeline'));
router.use('/line-items', require('./lineItems'));
router.use('/associations', require('./associations'));
router.use('/owner', require('./owner'));
router.use('/webhook', require('./webhookHubspot'));

module.exports = router;
