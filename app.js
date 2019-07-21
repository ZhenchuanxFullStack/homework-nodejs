const server = require('./server')
const router = require('./router')
 console.log(server)
server.start(router.route);

