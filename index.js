require('dotenv').config();
const { server, PORT } = require('./api/server');
const config = require('./config');

server.listen(PORT, () => {
  console.log(`Server on ${config.API_URL} , Fecha: ${new Date().toLocaleString('en-US')}`);
});
