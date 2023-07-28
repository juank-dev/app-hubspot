const { RegisterResolver } = require('../resolvers');
const { HubspotService } = require('../services');

module.exports = {
  createAssociations: async (req, res) => {
    let { portal_id, items } = req.body;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      const createRes = await HubspotService.createAssociations(items, token);
      return res.status(200).json(createRes);
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  getAssociations: async (req, res) => {
    let { portal_id, object, idObject, associationObject } = req.body;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      const createRes = await HubspotService.getAssociations(token, object, idObject, associationObject);
      return res.status(200).json(createRes);
    } catch (err) {
      console.log(err);
      return res.status(err.status || 400).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
};
