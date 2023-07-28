const { APILocation } = require('../services');

module.exports = {
  getToken: async (req, res) => {
    try {
      const token = await APILocation.getToken();
      return res.status(200).json({ token: token });
    } catch (err) {
      return res
        .status(err.status)
        .json({ message: err.message, statusText: err.statusText, code: err.status, type: type });
    }
  },
  getCountries: async (req, res) => {
    try {
      const token = await APILocation.getToken();
      const countries = await APILocation.getCountries(token);
      return res.status(200).json({ countries });
    } catch (err) {
      return res
        .status(err.status)
        .json({ message: err.message, statusText: err.statusText, code: err.status, type: type });
    }
  },
  getStates: async (req, res) => {
    let { country } = req.body;
    try {
      const token = await APILocation.getToken();
      const states = await APILocation.getStates(token, country);
      return res.status(200).json({ states });
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
  getCities: async (req, res) => {
    let { state } = req.body;
    try {
      const token = await APILocation.getToken();
      const cities = await APILocation.getCities(token, state);
      return res.status(200).json({ cities });
    } catch (err) {
      return res.status(err.status).json({ message: err.message, statusText: err.statusText, code: err.status });
    }
  },
};
