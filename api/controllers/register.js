const { RegisterResolver } = require('../resolvers');
const { HubspotService } = require('../services');

module.exports = {
  saveUser: async (req, res) => {
    let { refresh_token } = req.body;
    let { token } = req.headers;
    try {
      const { user: username, hub_domain, hub_id: portal_id, app_id, user_id } = await HubspotService.getUser(token);
      const findRegister = await RegisterResolver.get(portal_id);
      if (!findRegister) {
        const resp = await RegisterResolver.save({ username, hub_domain, portal_id, app_id, user_id, refresh_token });
        return res.status(200).json(resp);
      }
      return res.status(409).json({ message: `Portal ${portal_id} ya existe en la Base de Datos`, code: 409 });
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  getUser: async (req, res) => {
    const { portal_id } = req.params;
    //*
    try {
      const resp = await RegisterResolver.get(portal_id);
      return res.status(200).json(resp || { access: false, message: 'No hay registro del portal ' + portal_id });
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
};
