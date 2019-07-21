const { spawn } = require('child_process')
const chokidar = require('chokidar')

let p = spawn('node', ['app.js'])

chokidar.watch('.', {
  ignored: /node_modules|\.git/,
  persistent: true,
}).on('change', path => {
  p.kill()
  p = spawn('node', ['app.js'])
  console.log(`File ${path} has been changed, pid is ${p.pid}`)
}).on('error', error => {
  console.log(`Watcher error: ${error}`)
})
