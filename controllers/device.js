const os = require('os')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const getMemoryInfo = function() {
  return {
    freemem: os.freemem(),
    totalmem: os.totalmem()
  }
}

const getCpuInfo = function() {
  return os.cpus()
}

const getProcessInfo = function() {
  return new Promise((resolve, reject) => {
    const command = process.platform === 'win32' ? 'tasklist' : 'ps aux'
    exec(command, function(err, stdout, stderr) {
      if (err) {
        reject(err)
        return
      }
      const lines = stdout.toString().split('\n')
      const processList = lines.slice(3, -1)
        .map((line) => {
          const arr = line.trim().split(/\s{2,}/)
          return {
            pName: arr[0],
            pId: arr[1],
            cpu: arr[3].replace(/ K|,/g, '') * 1
          }
        })
        .sort((x, y) => x.cpu - y.cpu)
      resolve(processList)
    })
  })
}

module.exports = {
  getMemoryInfo,
  getCpuInfo,
  getProcessInfo
}
