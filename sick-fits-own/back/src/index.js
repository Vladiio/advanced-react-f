require('dotenv').config();
const createServer = require('./createServer');

createServer().start((e) =>
  console.log(e)
);
