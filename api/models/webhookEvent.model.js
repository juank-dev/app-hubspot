const { Model, DataTypes } = require('sequelize');

const WEBHOOK_EVENT_TABLE = 'webhook_events';

const WebhookEventSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  eventType: {
    field: 'event_type',
    type: DataTypes.STRING,
    allowNull: false,
  },
  liveMode: {
    field: 'live_mode',
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  eventId: {
    field: 'event_id',
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventObject: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  payloadObject: {
    field: 'payload_object',
    type: DataTypes.STRING,
    allowNull: false,
  },
  objectPayload: {
    field: 'object_payload',
    type: DataTypes.TEXT,
    allowNull: false,
  },
  objectId: {
    field: 'object_id',
    type: DataTypes.STRING,
    allowNull: false,
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: DataTypes.NOW,
  },
  eventSource: {
    field: 'event_source',
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    field: 'state',
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'unprocessed',
  },
};

class WebhookEvent extends Model {
  static associate() {}
  static config(sequelize) {
    return {
      sequelize,
      tableName: WEBHOOK_EVENT_TABLE,
      modelName: 'WebhookEvent',
      timestamp: false,
    };
  }
}

module.exports = { WebhookEvent, WebhookEventSchema, WEBHOOK_EVENT_TABLE };
