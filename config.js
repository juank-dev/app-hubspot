const dotenv = require('dotenv');

const Config = {
  development: {
    API_URL: process.env.API_URL_DEV,
    enviroment: 'development',
    ID_APP: process.env.ID_APP_DEV,
    CLIENT_ID: process.env.CLIENT_ID_DEV,
    CLIENT_SECRET: process.env.CLIENT_SECRET_DEV,
    PORT: process.env.PORT,
    SCOPE: process.env.SCOPE_DEV,
  },
  local: {
    API_URL: process.env.API_URL_LOCAL,
    enviroment: 'local',
    ID_APP: process.env.ID_APP_LOCAL,
    CLIENT_ID: process.env.CLIENT_ID_LOCAL,
    CLIENT_SECRET: process.env.CLIENT_SECRET_LOCAL,
    PORT: process.env.PORT,
    SCOPE: process.env.SCOPE_LOCAL,
  },
  production: {
    API_URL: process.env.API_URL,
    enviroment: 'production',
    ID_APP: process.env.ID_APP,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    PORT: process.env.PORT,
    SCOPE: process.env.SCOPE,
  },
};
console.log(Config[process.env.NODE_ENV]);
module.exports = Config[process.env.NODE_ENV];
