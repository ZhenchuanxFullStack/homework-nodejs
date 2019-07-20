const os = require('os')
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec

/** 获取系统所有进程信息 
 * LINUX: PID CPU MEM COMMAND
 * WINDOWS: NAME PID MEM
 * windows系统貌似获取不到cpu占用率，只能获取内存占用率 
*/
module.exports.getProcessList = async function () {
  return new Promise((resolve, reject) => {
    let arr = []
    let isLiunx = os.platform() === 'linux'
    if (isLiunx) {
      exec('ps aux', (err, stdout, stderr) => {
        stdout.split('\n').forEach(line => {
          let lArr = line.split(/\s+/)
          if (parseInt(lArr[1])) {
            arr.push({'PID': lArr[1], 'CPU': lArr[2], 'MEM': lArr[3], 'COMMAND': lArr[10]})
          }
        })
        arr.sort((a, b) => {
          return b['CPU'] - a['CPU']
        })
        resolve(arr)
      })
    } else {
      exec('tasklist', (err, stdout, stderr) => {
        if (err) throw err;
        stdout.split('\n').forEach(line => {
          let lArr = line.split(/\s{2}/) // '2': windows下面进程名称有空格： System Idle Process
          let fArr = lArr.filter(item => item !== '')
          // 过滤一些不需要的东西，比如内存占用为0的和可能发生错误的
          if (fArr[0] && fArr[1] && (fArr[3] && parseInt(fArr[3].trim()) > 0)) {
            arr.push({'NAME': fArr[0], 'PID': fArr[1].trim().split(' ')[0], 'MEM': fArr[3].trim()})
          }
        });
        arr.sort((a, b) => {
          // 这时的内存值可能是这样：40,324 K (有逗号)
          // b在前是降序，a在前是升序
          return parseInt(b['MEM'].replace(',', '')) - parseInt(a['MEM'].replace(',', ''))
        });
        resolve(arr)
      })
    }
  })
}