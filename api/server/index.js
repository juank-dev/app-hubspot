require('dotenv').config();
const express = require('express');
const session = require('express-session');
const server = express();
const bodyParser = require('body-parser');

const cors = require('cors');
const routerApi = require('../router');

const installer = require('../router/installer');
const assets = require('../router/assets');
const views = require('../router/views');

const PORT = process.env.PORT || 4000;
require('../../config');

server.use(express.urlencoded({ extended: true }));
server.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
//? Use a session to keep track of client ID
server.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
  })
);
server.use(cors());

server.use(installer);
server.use(assets);
server.use(views);

//Rutas de la api
server.use('/api/v1', routerApi);

module.exports = {
  server,
  PORT,
};
