const http = require('http')

const util = require('util')
const exec = util.promisify(require('child_process').exec)

const formatData = async () => {
  // cpu 信息
  const cpuInfo = await getSysInfo('/proc/cpuinfo')
  const memInfo = await getSysInfo('/proc/meminfo')
  const processInfo = await getProcessInfo('--sort=-%cpu')
  return {
    cpuInfo,
    memInfo,
    processInfo
  }
}
const getSysInfo = async (device) => {
  const { stdout, stderr } = await exec(`cat ${device}`);
  if (stderr) return false
  const info = {}
  stdout.replace(/(?!\n)[\s]+/g,'').split('\n').map(line => {
    const [key, value] = line.split(':')
    info[key] = value
  })
  return info
}

const getProcessInfo = async (option) => {
  // 测试就只显示10个
  const { stdout, stderr } = await exec(`ps aux ${option}| head -n 11`);
  if (stderr) return false
  let label = {}
  const infoList = []
  stdout.split('\n').map((line, idx) => {
    // 跳过空行
    if (line === '') return

    if (idx === 0) {
      label = line.split(' ').filter(key => key)
      return
    }
    const info = {}
    line.split(' ').filter(key => key).map((value, index) => {
      if (!label[index]) return
      info[label[index]] = value
    })
    infoList.push(info)
  })
  return infoList
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