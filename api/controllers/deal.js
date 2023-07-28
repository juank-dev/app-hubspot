const { RegisterResolver } = require('../resolvers');
const { HubspotService } = require('../services');

module.exports = {
  createDeal: async (req, res) => {
    let { vid, portal_id, properties } = req.body;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      const createRes = await HubspotService.createDeal(vid, properties, token);
      return res.status(200).json(createRes);
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  createPropertyDeal: async (req, res) => {
    let content = req.body;
    let { token, type } = req.headers;
    try {
      const resp = await HubspotService.createPropertiesDeal(content, token);
      return res.status(200).json({ data: resp, type: type });
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ message: err.message, statusText: err.statusText, code: err.status, type: type });
    }
  },
  getDeal: async (req, res) => {
    let { portal_id, idDeal } = req.params;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      const resGetDeal = await HubspotService.getDeal(token, idDeal);
      return res.status(200).json(resGetDeal);
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  update: async (req, res) => {
    let { idDeal, portal_id, properties } = req.body;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      const createRes = await HubspotService.updateDeal(token, idDeal, properties);
      return res.status(200).json(createRes);
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  async createGroupPropertyCustom(req, res) {
    try {
      let  content = req.body;
      let { token } = req.headers;
      let resCustomGroupProperty = await HubspotService.createGroupProperties(token, content, "deals");
      res.status(200).json(resCustomGroupProperty);
    } catch (err) {
      return res.status(err.status || 500).json({
        message: err.message || err.response,
      });
    }
  },
};
