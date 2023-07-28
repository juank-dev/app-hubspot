const { RegisterResolver } = require('../resolvers');
const { HubspotService } = require('../services');

const recursiveGetProduct = async (token, array, after = 0) => {
  try {
    const { results, paging } = await HubspotService.searchProduct(token, 'CotizadorTriario', after);
    if (paging) {
      return recursiveGetProduct(token, [...results, ...array], paging.next.after);
    }
    return [...results, ...array];
  } catch (err) {
    console.warn(err);
  }
};
const recursiveGetProductInmobiliario = async (token, array, after = 0) => {
  try {
    const { results, paging } = await HubspotService.searchProduct(token, 'Inmobiliario', after);
    if (paging) {
      return recursiveGetProductInmobiliario(token, [...results, ...array], paging.next.after);
    }
    return [...results, ...array];
  } catch (err) {
    console.warn(err);
  }
};

module.exports = {
  createPropertyProduct: async (req, res) => {
    let content = req.body;
    let { token, type } = req.headers;
    try {
      const resp = await HubspotService.createPropertiesProduct(content, token);
      return res.status(200).json({ data: resp, type: type });
    } catch (err) {
      return res
        .status(err.status)
        .json({ message: err.message, statusText: err.statusText, code: err.status, type: type });
    }
  },
  getPropertiesProduct: async (req, res) => {
    let { portal_id } = req.params;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);

      const resp = await HubspotService.getProperties(token);
      let propertiesHS = HubspotService.propertiesHubspotProduct();
      //Devolver respuesta de las propiedades necesarias
      const filterProperties = resp.filter((el) => propertiesHS.includes(el.name));

      return res.status(200).json(filterProperties);
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  async searchProduct(req, res) {
    let { portal_id, type, country, state, city, project, urbanization, tower, number_apto, range_price, area_range, model } =
      req.body;
    let {all, includesPlane } = req.query;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);
      let results = await recursiveGetProductInmobiliario(token, []);
      //* listar las que estan con disponibilidad
      let onlyAvailable = all === "true" ? results :results.filter((el) => el.properties.available == 'true');

      let filterResults = onlyAvailable.filter((el) => {
        let price = Number(el.properties.price);
        let isRangePrice = range_price ? range_price.min <= price && range_price.max >= price : true;
        let area = Number(el.properties.constructed_area);
        let isRangeArea = area_range ? area_range.min <= area && area_range.max >= area : true;
        let onlyPlane = includesPlane === "true" && (el.properties.type ? el.properties.type.includes('Plano'): false);

        return (
          (type ? type === el.properties.type : true) &&
          (country ? country === el.properties.country : true) &&
          (state ? state === el.properties.state : true) &&
          (city ? city === el.properties.city : true) &&
          (project ? project === el.properties.project : true) &&
          (urbanization ? urbanization === el.properties.urbanization : true) &&
          (tower ? tower === el.properties.tower : true) &&
          (number_apto ? number_apto === el.properties.number_apto : true) &&
          (model ? (onlyPlane ? true: model === el.properties.model) : true) &&
          isRangePrice &&
          isRangeArea
        );
      });
      return res.status(200).json(filterResults);
    } catch (err) {
      console.log(err);
      return res
        .status(err.status)
        .json({ message: err.message, statusText: err.statusText, code: err.status, type: type });
    }
  },
  update: async (req, res) => {
    let { portal_id, product_id, data } = req.body;
    try {
      const dataUser = await RegisterResolver.get(portal_id);
      if (!dataUser)
        throw { message: `No se encontro portal asociado ${portal_id}`, status: 401, statusText: 'No existe' };
      const token = await HubspotService.refreshAccessToken(null, dataUser.refresh_token);

      const resp = await HubspotService.updateProduct(product_id, data, token);
      return res.status(200).json(resp);
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  async getProductCotizadorTriario(req, res) {
    //? EL TOKEN ES UNA APP PRIVADA DE TRIARIO
    try {
      const token = process.env.APP_PRIVADA;

      let results = await recursiveGetProduct(token, []);
      //* listar las que estan son servicios del cotizador de triario
      let onlyServices = results.filter((el) => el.properties.hs_product_type === 'Servicio Cotizador Triario');
      return res.status(200).json({ data: onlyServices });
    } catch (err) {
      console.log(err);
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  async createGroupPropertyCustom(req, res) {
    try {
      let  content = req.body;
      let { token } = req.headers;
      let resCustomGroupProperty = await HubspotService.createGroupProperties(token, content, "products");
      res.status(200).json(resCustomGroupProperty);
    } catch (err) {
      return res.status(err.code || 500).json({
        message: err.message || err.response,
      });
    }
  },
};
