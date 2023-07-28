const { Client, ClientSchema } = require('./client.model');
const { WebhookEvent, WebhookEventSchema } = require('./webhookEvent.model');

const setupModels = (sequelize) => {
  Client.init(ClientSchema, Client.config(sequelize));
  WebhookEvent.init(WebhookEventSchema, WebhookEvent.config(sequelize));
};

module.exports = setupModels;
