const http = require('http')
const url = require('url')

function start(route) {
  function onRquest(req, res) {
    let pathname = url.parse(req.url).pathname
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    route(pathname, res)
  }
  http.createServer(onRquest).listen(8888, '0.0.0.0')
  console.log('server has started')
}

exports.start = start