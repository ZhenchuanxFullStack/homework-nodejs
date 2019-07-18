const http = require('http')

const util = require('util')
const exec = util.promisify(require('child_process').exec)

const formatData = async () => {
  // cpu 信息
  const cpuInfo = await getSysInfo('abc.txt')
  const memInfo = await getSysInfo('abc.txt')
  const processInfo = await getSysInfo('abc.txt')
  return {
    cpuInfo,
    memInfo,
    processInfo
  }
}
const getSysInfo = async (device) => {
  const { stdout, stderr } = await exec(`cat ./${device}`);
  if (stderr) return false
  return stdout.replace(/(?!\n)[\s]+/g,'').split('\n').map(val => {
    const [key, value] = val.split(':')
    return {key, value}
  })
}

const server = http.createServer(async (req, res) => {
  if (req.url.indexOf('/device') != 0) {
    res.statusCode = 404
    return res.end()
  }
  
  res.writeHead(200,{"content-type":"application/json"})
  const data = await formatData()
  res.end(JSON.stringify({
    code: 'sucess',
    data
  }))
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
})
server.listen(8000)