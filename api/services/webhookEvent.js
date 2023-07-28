const { models } = require('../db');

class webhookEvents {
  constructor() {
    // this.models = models;
  }
  async create(event, source) {
    let webhookEvent;
    const data = this.parseEvent(event, source);
    try {
      switch (source) {
        case 'stripe':
          webhookEvent = await models.WebhookEvent.create(data);
          break;
        case 'hubspot':
          webhookEvent = await models.WebhookEvent.bulkCreate(data);
          break;
        case 'internal':
          webhookEvent = await models.WebhookEvent.create(data);
          break;
        default:
          webhookEvent = await models.WebhookEvent.create(data);
          break;
      }
    } catch (err) {
      throw {
        message: err.message || `Hubo un error al crear Evento Webhook`,
        status: 401,
        statusText: 'Error Webhook',
      };
    }

    return webhookEvent;
  }
  parseEvent(event, source) {
    let data;
    switch (source) {
      case 'stripe':
        data = {
          eventType: event.type,
          liveMode: event.livemode,
          eventId: event.id,
          eventObject: event.object,
          payloadObject: event.data.object.object,
          objectPayload: JSON.stringify(event.data.object),
          objectId: event.data.object.id,
          payload: JSON.stringify(event.data.object),
          eventSource: 'stripe',
        };
        break;
      case 'internal':
        data = {
          eventType: event.type,
          liveMode: event.livemode,
          eventId: event.id,
          eventObject: event.object,
          payloadObject: event.data.object.object,
          objectPayload: JSON.stringify(event.data.object),
          objectId: event.data.object.id,
          payload: JSON.stringify(event.data.object),
          eventSource: 'internal',
        };
        break;
      case 'hubspot':
        data = [];
        event.forEach((item) => {
          data.push({
            eventType: item.eventType,
            liveMode: true,
            eventId: String(item.eventId),
            eventObject: 'hubspot',
            payloadObject: JSON.stringify(item),
            objectPayload: JSON.stringify(item),
            objectId: String(item.objectId),
            payload: JSON.stringify(item),
            eventSource: 'hubspot',
          });
        });
        break;
      default:
        data = {};
        break;
    }
    return data;
  }
  async getEvent(eventId) {
    let webhookEvent;
    try {
      webhookEvent = await models.WebhookEvent.findOne({
        where: {
          eventId: eventId,
        },
      });
      webhookEvent['payload'] = JSON.parse(webhookEvent['payload']);
    } catch (err) {
      throw {
        message: err.message || `Hubo un error al obtener Evento Webhook`,
        status: 401,
        statusText: 'Error Webhook',
      };
    }
    return webhookEvent;
  }
}

module.exports = webhookEvents;
