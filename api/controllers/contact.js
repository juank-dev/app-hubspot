const { RegisterResolver } = require('../resolvers');
const { HubspotService } = require('../services');

module.exports = {
  /**
   * <p><b>Descripción: </b> Obtener lista de contactos</p>
   * @name Nuclear - Obtener contactos
   * @path {POST} /get-contacts
   * @header {String} Content-type application/json
   * @body {String} search= Obtener usuarios
   * @code {200} Si la petición es exitosa
   */

  searchContact: async (req, res) => {
    const resp = await HubspotService.getSearchContact(req.body.search /* , configCompany.hapikey */);
    return res.status(200).json({ data: resp.data });
  },
  updateContact: async (req, res) => {
    let { vid, properties, portal_id } = req.body;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      const resUpdate = await await HubspotService.updateContactById(token, vid, properties);
      return res.status(200).json(resUpdate);
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  createContact: async (req, res) => {
    let { properties, portal_id } = req.body;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      const createRes = await HubspotService.createContact(properties, token);
      return res.status(200).json(createRes);
    } catch (err) {
      /* code 409 contacto ya existe */
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  getContactByEmail: async (req, res) => {
    let { email, portal_id } = req.body;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      const resContact = await HubspotService.getContactByEmail(email, token);
      return res.status(200).json(resContact);
    } catch (err) {

      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  getContactById: async (req, res) => {
    let { vid, portal_id } = req.body;
    let { token: appToken } = req.headers;
    try {
      let token = null;
      if(appToken) {
        token = appToken;
      } else {
        const dataUser = await RegisterResolver.get(portal_id);
        if (!dataUser)
          throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
        token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      }
     

      const resContact = await HubspotService.getContactById(vid, token);
      return res.status(200).json(resContact);
    } catch (err) {

      return res.status(err.status || 500).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  getContactByEmailTriario: async (req, res) => {
    let { email } = req.body;
    try {
      const token = process.env.APP_PRIVADA;
      console.log({ email, token });
      const createRes = await HubspotService.getContactByEmail(email, token);
      return res.status(200).json(createRes);
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  updateContactTriario: async (req, res) => {
    let { vid, properties } = req.body;
    try {
      const token = process.env.APP_PRIVADA;
      const resUpdate = await await HubspotService.updateContactById(token, vid, properties);
      return res.status(200).json(resUpdate);
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  createPropertyContact: async (req, res) => {
    let content = req.body;
    let { token, type } = req.headers;
    try {
      const resp = await HubspotService.createPropertiesContact(token, content);
      return res.status(200).json({ data: resp, type: type });
    } catch (err) {
      return res
        .status(err.status)
        .json({ message: err.message, statusText: err.statusText, code: err.status, type: type });
    }
  },
};
