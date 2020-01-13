const http = require('http');
const app = require('./app');
const port = 3000;
//createServer(requestListener)
const server = http.createServer(app);
server.listen(port);
