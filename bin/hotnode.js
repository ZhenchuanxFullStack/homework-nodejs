const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const file = path.join(path.resolve(__dirname), '../app.js')

const filesList = []

// 通过exec启动
let process = exec('node app.js')
let pid = process.pid

// 递归获取所有文件
function readFileList (dir, filesList = []) {
  const files = fs.readdirSync(dir)
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList)  //递归读取文件
    } else {
      filesList.push(fullPath)
    }
  })
  return filesList
}
readFileList(path.join(path.resolve(__dirname), '../routers'), filesList)

filesList.push(file)

filesList.forEach((element) => {
  console.log(element)
  fs.watch(element, (eventType, filename) => {
    if (filename && eventType === 'change') {
      console.log(` ${filename} 文件修改 ， 服务器正在重启中..`)
      process.kill()
      process = exec('node app.js')
      pid = process.pid
      console.log(`hotnode server is on port 5000 , pid is ${pid}`)
    }
  })
})

console.log(`hotnode server is on port 5000 , pid is ${pid}`)
