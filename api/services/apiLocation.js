const axios = require('axios');

module.exports = {
  getToken: async () => {
    try {
      const config = {
        method: 'get',
        url: 'https://www.universal-tutorial.com/api/getaccesstoken',
        headers: {
          'api-token': process.env.TOKEN_APP_COUNTRY,
          'user-email': process.env.EMAIL_APP_COUNTRY,
        },
      };

      let response = await axios(config);

      return response.data.auth_token;
    } catch (err) {
      throw {
        message: err.message || '',
        status: err.response?.status || '',
        statusText: err.response?.statusText || '',
      };
    }
  },
  getCountries: async (token) => {
    try {
      const config = {
        method: 'get',
        url: 'https://www.universal-tutorial.com/api/countries/',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response = await axios(config);

      return response.data;
    } catch (err) {
      throw {
        message: err.message || '',
        status: err.response?.status || '',
        statusText: err.response?.statusText || '',
      };
    }
  },
  getStates: async (token, country) => {
    try {
      const config = {
        method: 'get',
        url: `https://www.universal-tutorial.com/api/states/${country}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response = await axios(config);

      return response.data;
    } catch (err) {
      throw {
        message: err.message || '',
        status: err.response?.status || '',
        statusText: err.response?.statusText || '',
      };
    }
  },
  getCities: async (token, state) => {
    try {
      const config = {
        method: 'get',
        url: `https://www.universal-tutorial.com/api/cities/${state}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response = await axios(config);

      return response.data;
    } catch (err) {
      throw {
        message: err.message || '',
        status: err.response?.status || '',
        statusText: err.response?.statusText || '',
      };
    }
  },
};
