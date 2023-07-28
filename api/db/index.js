const { Sequelize } = require('sequelize');
const setupModels = require('../models');

const config = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.BD_SERVER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.server,
    port: config.port,
    dialect:  'postgres',
    logging: true,
});

setupModels(sequelize);
sequelize.sync({alter: true});

module.exports = sequelize;
