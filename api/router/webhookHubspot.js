const express = require('express');
const router = express.Router();
const { WebhookHubspotController } = require('../controllers');

router.post('/', WebhookHubspotController.createEvent);
router.get('/:eventId', WebhookHubspotController.getEvent);

module.exports = router;
