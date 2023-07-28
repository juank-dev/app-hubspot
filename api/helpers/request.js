const axios = require('axios');

module.exports = (config) => {
  config.timeout = 5000;
  return new Promise(function (resolve, reject) {
    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error.response?.data?.mensaje) {
          console.log('ERROR', error.response.data.mensaje);
          resolve(error.response.data.mensaje);
        } else {
          reject('error');
        }
      });
  });
};
