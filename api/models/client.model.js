const { Model, DataTypes, Sequelize } = require('sequelize');

const CLIENT_TABLE = 'clients';

const ClientSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },

  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  hub_domain: {
    field: 'domain_hubspot',
    type: DataTypes.STRING,
    allowNull: false,
  },
  portal_id: {
    field: 'portal_id',
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  app_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  enviroment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

class Client extends Model {
  static associate() {}
  static config(sequelize) {
    return {
      sequelize,
      tableName: CLIENT_TABLE,
      modelName: 'Client',
      timestamp: false,
    };
  }
}

module.exports = { Client, ClientSchema, CLIENT_TABLE };
