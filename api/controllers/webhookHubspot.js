const { WebhookService, HubspotService } = require('../services');
const webhookEvents = new WebhookService();

const createEvent = async (req, res) => {
  const payload = req.body;
  let webhookEvent;
  try {
    HubspotService.validateSign(req);
    webhookEvent = await webhookEvents.create(payload, 'hubspot');
    return res.status(200).json(webhookEvent);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getEvent = async (req, res) => {
  const eventId = req.params.eventId;
  let webhookEvent;
  try {
    webhookEvent = await webhookEvents.getEvent(eventId);
    return res.status(200).json(webhookEvent);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createEvent,
  getEvent,
};
