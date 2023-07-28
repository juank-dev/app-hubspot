const { RegisterResolver } = require('../resolvers');
const { HubspotService } = require('../services');

module.exports = {
  createPipeline: async (req, res) => {
    let content = req.body;
    let { token, type } = req.headers;
    try {
      const allPipelines = await HubspotService.getAllPipelines(token, type);
      const findPipeline = allPipelines.results.find((el) => el.label === content.label);
      if (findPipeline)
        return res
          .status(409)
          .json({ message: `Pipeline ${content.label} ya existe`, statusText: `Pipeline existe`, code: 409 });
      const resp = await HubspotService.createPipeline(content, token, type);
      return res.status(200).json(resp);
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  getPipeline: async (req, res) => {
    let { portal_id, pipelineName, type } = req.body;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      const allPipelines = await HubspotService.getAllPipelines(token, type);
      const findPipeline = allPipelines.results.find((el) => el.label === pipelineName);
      return res.status(200).json(findPipeline);
    } catch (err) {
      return res
        .status(err.status || 500)
        .json({ message: err.message || err.response, statusText: err.statusText, code: err.status });
    }
  },
};
