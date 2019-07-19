const http = require('http')
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec

const server = http.createServer((req, res) => {
  if (req.url === '/device') {
    const currentPath = process.cwd()
    const processJsonPath = path.join(currentPath, 'process.json')
    const cpuLogPath = path.join(currentPath, 'cpu.log')
    const memoryLogPath = path.join(currentPath, 'memory.log')
    // 将当前所有进程信息写入json文件
    exec('ps aux', (err, stdout, stderr) => {
      if (err) return
      const allProcessData = []
      const processList = stdout.split('\n').slice(1).forEach((process) => {
        const processData = process.split(/\s+/g)
        allProcessData.push({
          command: processData[10],
          user: processData[0],
          cpu: processData[2] + '%'
        })
      })
      fs.writeFile(processJsonPath, JSON.stringify(allProcessData), (err) => {
        if (err) throw err;
      })
    })
    // cpu信息写入log
    exec('iostat', (err, stdout, stderr) => {
      if (err) return
      fs.writeFile(cpuLogPath, stdout, (err) => {
        if (err) throw err
      })
    })
    // memory信息写入log
    exec('free -m', (err, stdout, stderr) => {
      if (err) return
      fs.writeFile(memoryLogPath, stdout, (err) => {
        if (err) throw err
      })
    })
    res.end('Snapshot of server will create!')
  } else {
    res.end('Not found ')
  }
})
server.listen(8080, '127.0.0.1')
console.log('Server is running at 8080')
