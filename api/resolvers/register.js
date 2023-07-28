const config = require('../../config');
const { models } = require('../db');
module.exports = {
  async save({ username, hub_domain, portal_id, app_id, user_id, refresh_token }) {
    const response = await models.Client.create({
      username,
      hub_domain,
      portal_id,
      app_id,
      user_id,
      refresh_token,
      enviroment: config.enviroment,
    });
    return response;
  },

  async get(portal_id) {
    const registerId = await models.Client.findOne({
      where: { portal_id, enviroment: config.enviroment },
    });
    return registerId;
  },
};
