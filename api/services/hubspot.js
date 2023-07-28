const axios = require('axios');
const crypto = require('crypto');
const NodeCache = require('node-cache');
const refreshTokenStore = {};
const accessTokenCache = new NodeCache({ deleteOnExpire: true });
const request = require('request-promise-native');
const config = require('../../config');

const { Request } = require('../helpers');

const CLIENT_ID = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const URL_API = config.API_URL;
const REDIRECT_URI = `${URL_API}/oauth-callback`;
const URL_API_WEBHOOK = `${URL_API}/api/v1/webhook`;

module.exports = {
  validateSign: (req) => {
    const payload = req.body;
    const signature = req.headers['X-HubSpot-Signature'];
    const version = req.headers['X-HubSpot-Signature-Version'];
    const requestTimestamp = req.headers['X-HubSpot-Request-Timestamp'];
    let hash, source_string;
    switch (version) {
      case 'v1':
        source_string = CLIENT_SECRET + JSON.stringify(payload);
        hash = crypto.createHash('sha256').update(source_string).digest('hex');
        if (hash !== signature) {
          throw Error('Hubspot signature is not valid');
        }
        break;
      case 'v2':
        source_string = CLIENT_SECRET + req.method + URL_API_WEBHOOK + JSON.stringify(payload);
        hash = crypto.createHash('sha256').update(payload).digest('hex');
        if (hash !== signature) {
          throw Error('Hubspot signature is not valid');
        }
        break;
      case 'v3':
        // TODO: validar si es mayor de 5 minutos
        // Create a utf-8 encoded string that concatenates together the following requestMethod + requestUri + requestBody +timestamp
        source_string = req.method + CLIENT_SECRET + URL_API_WEBHOOK + JSON.stringify(payload) + requestTimestamp;
        // Create an HMAC SHA-256 hash of the resulting string using the application secret as the secret for the HMAC SHA-256 function
        hash = crypto.createHmac('sha256', CLIENT_SECRET).update(source_string).digest('hex');
        // Base64 encode the result of the HMAC function
        hash = Buffer.from(hash).toString('base64');
        if (hash !== signature) {
          throw Error('Hubspot signature is not valid');
        }
        break;
      default:
        throw Error('Hubspot signature version is not valid');
    }
  },
  async getContactByEmail(email, token) {
    const config = {
      method: 'get',
      url: `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al buscar al contacto ${email}` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async getContactById(contactId, token) {
    const config = {
      method: 'get',
      url: `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al buscar al contacto ${email}` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
 
  getSearchContact: (search, apikey) => {
    return new Promise(async (resolve) => {
      let properties = [
        'mobilephone',
        'phone',
        'email',
        'firstname',
        'lastname',
        'address',
        'id_messenger',
        'hs_lead_status',
        'hubspot_owner_id',
      ];
      let queryProperties = '';
      for (const property of properties) {
        queryProperties += `&property=${property}`;
      }
      const resp = await axios.get(
        `https://api.hubapi.com/contacts/v1/search/query?q=${search}&hapikey=${apikey}${queryProperties}&count=50`
      );
      resolve(resp);
    });
  },
  getAllProps: (apikey) => {
    let headers = { 'Content-Type': 'application/json' };
    return new Promise(async (resolve) => {
      const res = await axios.get(`https://api.hubapi.com/properties/v1/contacts/properties?hapikey=${apikey}`);
      resolve(res.data);
    });
  },
  getOneProp: (apikey, property) => {
    return new Promise(async (resolve) => {
      const res = await axios.get(
        `https://api.hubapi.com/properties/v1/contacts/properties/named/${property}?hapikey=${apikey}`
      );
      resolve(res.data);
    });
  },
  getPropsGroups: (apikey) => {
    return new Promise(async (resolve) => {
      const res = await axios.get(`https://api.hubapi.com/properties/v1/contacts/groups?hapikey=${apikey}`);
      resolve(res.data);
    });
  },
  async updateContactById(token, vid, properties) {
    const config = {
      method: 'post',
      url: `https://api.hubapi.com/contacts/v1/contact/vid/${vid}/profile`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        properties,
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de la propiedad' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },

  getOwnerById: (ownerId, apikey) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`http://api.hubapi.com/owners/v2/owners/${ownerId}?hapikey=${apikey}`);
        resolve(res);
      } catch (err) {
        resolve(null);
      }
    });
  },
  async createContact(properties, token) {
    let headers = { 'Content-Type': 'application/json' };
    var config = {
      method: 'post',
      url: `https://api.hubapi.com/contacts/v1/contact`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: { properties },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de Contacto' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        status: err.response?.status || 400,
        statusText: err.response?.statusText || '',
      };
    }
    return new Promise(async (resolve) => {
      const res = await axios.post(
        `https://api.hubapi.com/contacts/v1/contact?hapikey=${apikey}`,
        { properties },
        { headers }
      );
      resolve(res);
    });
  },
  async exchangeForTokens(userId, exchangeProof, refreshTokenStore) {
    try {
      const responseBody = await request.post('https://api.hubapi.com/oauth/v1/token', {
        form: exchangeProof,
      });

      // Usually, this token data should be persisted in a database and associated with
      // a user identity.
      const tokens = JSON.parse(responseBody);
      if (userId) {
        refreshTokenStore[userId] = tokens.refresh_token;
        accessTokenCache.set(userId, tokens.access_token, Math.round(tokens.expires_in * 24 * 60 * 60 * 1000));
        console.log('       > Received an access token and refresh token');
      }

      return tokens.access_token;
    } catch (e) {
      console.error(`       > Error exchanging ${exchangeProof.grant_type} for access token`);
      return 'AuthFailed';
    }
  },
  async getUser(accessToken) {
    if (!accessToken) return;
    console.log('=== Retrieving a contact from HubSpot using the access token ===');
    try {
      var options = {
        method: 'GET',
        url: `https://api.hubapi.com/oauth/v1/access-tokens/${accessToken}`,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      };
      const result = await Request(options);
      return result;
    } catch (e) {
      console.error('  > Unable to retrieve contact' + e);
      return JSON.parse(e);
    }
  },
  async refreshAccessToken(userId = null, refresh_token = null, refreshTokenStore = {}) {
    const refreshTokenProof = {
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      refresh_token: refresh_token || refreshTokenStore[userId],
    };
    let res = await this.exchangeForTokens(userId, refreshTokenProof);
    return res;
  },
  async getAccessToken(userId) {
    if (!accessTokenCache.get(userId)) {
      console.log('Refreshing expired access token');
      const refresh = this.refreshAccessToken(userId);
      return refresh;
    }
    return accessTokenCache.get(userId);
  },
  propertiesHubspotProduct() {
    return [
      'number_apto',
      'country',
      'constructed_area',
      'private_area',
      'city',
      'available',
      'project',
      'type',
      'tower',
      'urbanization',
      'state',
      'name',
      'price',
      'description',
      'section',
      'amount_product',
      'features',
      'rooms',
      'bathroom',
      'delivery_date',
      'coordenadas_plano',
      'hs_images',
      'hs_url',
      'piso___nivel___planta',
      'coordenadas_nivel',
      'coordenadas_torre',
      'coordenadas_urbanizacion',
      'coordenadas_nivel_torre',
      'model',
      'modelo_comercial'
    ];
  },
  propertiesHubspotProductCotizadorTriario() {
    return [
      'hs_product_type',
      'name',
      'a_la_medida',
      'addon_imp_marketing',
      'addon_imp_servicio',
      'addon_imp_ventas',
      'addon_inbound',
      'addon_seo',
      'addon_web',
      'cant_menu_a_la_medida',
      'cant_menu_enterprise',
      'cant_menu_pro',
      'cotiza_complemento',
      'description',
      'enterprise',
      'etapa',
      'hs_price_cop',
      'hs_sku',
      'imp__marketing',
      'imp__servicio',
      'imp__ventas',
      'inbound',
      'price',
      'pro',
      'seo',
      'web',
    ];
  },
  async createPropertiesProduct(content, token) {
    var config = {
      method: 'post',
      url: 'https://api.hubapi.com/properties/v2/products/properties/',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: content,
    };

    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de la propiedad' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async createPropertiesDeal(content, token) {
    var config = {
      method: 'post',
      url: 'https://api.hubapi.com/properties/v1/deals/properties/',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: content,
    };

    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de la propiedad en Negocio' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async createPropertiesContact(token, content) {
    var config = {
      method: 'post',
      url: 'https://api.hubapi.com/properties/v1/contacts/properties',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: content,
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de la propiedad en Negocio' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async getProperties(token) {
    const config = {
      method: 'get',
      url: 'https://api.hubapi.com/properties/v2/products/properties/',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de la propiedad' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async searchProduct(token, propertiesFlag, after = 0) {
    let propertiesQuery = '';
    if (propertiesFlag === 'CotizadorTriario') {
      for (const property of this.propertiesHubspotProductCotizadorTriario()) {
        propertiesQuery += `&properties=${property}`;
      }
    } else if (propertiesFlag === 'Inmobiliario') {
      for (const property of this.propertiesHubspotProduct()) {
        propertiesQuery += `&properties=${property}`;
      }
    }

    const config = {
      method: 'get',
      url: `https://api.hubapi.com/crm/v3/objects/products?limit=100&archived=false${propertiesQuery}&after=${after}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error buscando los productos' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async getAllPipelines(token, type) {
    var config = {
      method: 'get',
      url: `https://api.hubapi.com/crm/v3/pipelines/${type}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la consulta de los Pipelines' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async createPipeline(content, token, type) {
    var config = {
      method: 'post',
      url: `https://api.hubapi.com/crm/v3/pipelines/${type}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: content,
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de Pipeline' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async getDeal(token, idDeal) {
    const config = {
      method: 'get',
      url: `https://api.hubapi.com/deals/v1/deal/${idDeal}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async createDeal(vid, properties, token) {
    var config = {
      method: 'post',
      url: `https://api.hubapi.com/deals/v1/deal`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        associations: {
          associatedVids: [vid],
        },
        properties,
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de negocio' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        statusText: err.response?.statusText,
      };
    }
  },
  async updateDeal(token, idDeal, properties) {
    var config = {
      method: 'put',
      url: `https://api.hubapi.com/deals/v1/deal/${idDeal}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        properties,
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de negocio' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async createLineItem(products, token) {
    var config = {
      method: 'post',
      url: `https://api.hubapi.com/crm-objects/v1/objects/line_items/batch-create`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: products,
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de LineItems' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async createAssociations(items, token) {
    var config = {
      method: 'put',
      url: `https://api.hubapi.com/crm-associations/v1/associations/create-batch`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: items,
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la asociacion de elementos' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async getAssociations(token, object, idObject, associationObject) {
    //url: `https://api.hubapi.com/crm/v4/objects/deals/11081546272/associations/planpago?limit=500`,
    var config = {
      method: 'get',
      url: `https://api.hubapi.com/crm/v4/objects/${object}/${idObject}/associations/${associationObject}?limit=500`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la asociacion de elementos' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async updateProduct(id, data, token) {
    var config = {
      method: 'put',
      url: `https://api.hubapi.com/crm-objects/v1/objects/products/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con ACTUALIZAR EL PRODUCTO' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async getOwner(token) {
    const config = {
      method: 'get',
      url: `https://api.hubapi.com/owners/v2/owners`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al obtener Owners` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async getSchema(token, object) {
    const config = {
      method: 'get',
      url: `https://api.hubapi.com/crm/v3/schemas/${object}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al obtener Schema ${object}` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async createSchema(token, object) {
    const config = {
      method: 'post',
      url: `https://api.hubapi.com/crm/v3/schemas`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: object,
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async createListPagos(token, list) {
    const config = {
      method: 'post',
      url: `https://api.hubapi.com/crm/v3/objects/planpago/batch/create`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        inputs: list,
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async updateAssociationCustomObjectPago(token, idPago, typeObject, idObjectAssociate, typeAssociation) {
    const config = {
      method: 'put',
      url: `https://api.hubapi.com/crm/v3/objects/planpago/${idPago}/associations/${typeObject}/${idObjectAssociate}/${typeAssociation}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async getInfoPagos(token, idPago) {
    let propertiesQuery = '';
    let properties = ["name", "valor", "fecha_cuota", "cuota_separacion", "fixed_value", "observaciones", "numero_cuota", "status", "id_quote"];
      for (const property of properties) {
        propertiesQuery += `&properties=${property}`;
      }
    const config = {
      method: 'get',
      url: `https://api.hubapi.com/crm/v3/objects/planpago/${idPago}?archived=false${propertiesQuery}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async searchIdPagos(token, idQuote) {
    const config = {
      method: 'post',
      url: `https://api.hubapi.com/crm/v3/objects/planpago/search`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        filterGroups: [
          {
            "filters": [
              {
                "value": idQuote,
                "propertyName": "id_quote",
                "operator": "EQ"
              }
            ]
          }
        ],
        "sorts": [],
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async deleteIdPagos(token, idPago) {
    const config = {
      method: 'delete',
      url: `https://api.hubapi.com/crm/v3/objects/planpago/${idPago}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async updatePagos(token, listPagos) {
    const config = {
      method: 'post',
      url: `https://api.hubapi.com/crm/v3/objects/planpago/batch/update`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        inputs: listPagos,
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async createQuote(token, data) {
    const config = {
      method: 'post',
      url: `https://api.hubapi.com/crm/v3/objects/quotes`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data,
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Cotizacion ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async deleteQuote(token, quoteId) {
    const config = {
      method: 'delete',
      url: `https://api.hubapi.com/crm/v3/objects/quotes/${quoteId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al eliminar Cotizacion` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async updateDealToQuote(token, idDeal, idQuote) {
    const config = {
      method: 'put',
      url: `https://api.hubapi.com/crm/v3/objects/deal/${idDeal}/associations/quote/${idQuote}/deal_to_quote`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async associationTemplateQuoteToQuote(token, idTemplateQuote, idQuote) {
    const config = {
      method: 'put',
      url: `https://api.hubapi.com/crm/v3/objects/quote/${idQuote}/associations/quote_template/${idTemplateQuote}/quote_to_quote_template`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async updateStatusQuote(token, idQuote, status, currency) {
    const config = {
      method: 'patch',
      url: `https://api.hubapi.com/crm/v3/objects/quote/${idQuote}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        properties: {
          hs_status: status,
          hs_currency: currency,
        },
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async associationLineItemToQuote(token, idQuote, lineItemId) {
    const config = {
      method: 'put',
      url: `https://api.hubapi.com/crm/v3/objects/line_item/${lineItemId}/associations/quote/${idQuote}/line_item_to_quote`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async associationContactToQuote(token, idQuote, vid) {
    const config = {
      method: 'put',
      url: `https://api.hubapi.com/crm/v3/objects/contact/${vid}/associations/quote/${idQuote}/contact_to_quote`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al crear Schema ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },
  async getQuoteTemplate(token) {
    const config = {
      method: 'get',
      url: `https://api.hubapi.com/crm/v3/objects/quote_template?properties=hs_name,hs_active`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: `Hubo un error al obtener plantilla de Cotizacion ` };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  },

  async createGroupProperties(token, content, objectType) {
    var config = {
      method: 'post',
      url: `https://api.hubapi.com/crm/v3/properties/${objectType}/groups`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: content,
    };
  
    try {
      const res = await axios(config);
      if (res.status >= 200 && res.status < 300) {
        return res.data;
      } else {
        throw { message: 'Hubo un error con la creación de la propiedad en Negocio' };
      }
    } catch (err) {
      throw {
        message: err.response?.data || err.message,
        statusText: err.response?.statusText,
        status: err.response.status || 500,
      };
    }
  }
};
