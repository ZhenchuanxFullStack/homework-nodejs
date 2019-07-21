const os = require('os')
const cp = require('child_process')

/**
 * 
 * @param {*} total 字节数
 */
function countMem(total) {
  return (total / 1024 / 1024).toFixed(2)
}

function returnTpl(els) {
  return `<p style="border-top: 1px solid #eee;height: 40px;line-height: 40px;padding: 0;margin: 0;display: flex;"><span style="flex: 1;">${els[0]}</span><span style="flex: 1;">${els[1]}</span></p>`
}

function showDeviceInfo(res) {
  let freeMem = countMem(os.freemem())
  let typeCpu = os.arch()
  let cpus = os.cpus()
  let opType = os.type()
  let tpl = '<p>当前操作系统：'+ opType +'M</p>'
  tpl += '<p>你的剩余内存：'+ freeMem +'M</p>'
  tpl += '<p>cpu架构为：1'+ typeCpu +'</p>'
  tpl += '<p>cpu型号：'+ cpus[0]['model'] +'</p>'
  tpl += '<p>cpu处理速度：'+ (cpus[0]['speed'] / 1024).toFixed(2) +'G/Hz</p>'

  cp.exec('ps -eo %cpu,pid | sort -k 1 -rn', function (err, stdout, stderr) {  
    const arr = stdout.split('\n') 
    const htmlArr = []
    htmlArr.push(returnTpl(['cpu', 'pid']))
    arr.map(el => {
      
      el = el.replace(/(^\s*)|(\s*$)/g,"")
      if (el && el.indexOf('%CPU') === -1 && el.indexOf('PID') === -1) {
        console.log(el.split(' '))
        let els = el.replace(/(^\s*)|(\s*$)/g,"").split(' ')
        els = [els[0], els[els.length - 1]]
        htmlArr.push(returnTpl(els))
      }
    })

    let html = htmlArr.join()
    tpl += html
    tpl = tpl.replace(/,/ig, '')
    tpl = `<div style="width: 500px; margin: 0 auto; padding: 10px;">${tpl}</div>`
    res.write(tpl)
    res.end()
    
  })
 
}

function route(pathName, res) {
  if (pathName === '/device') {
    showDeviceInfo(res)
  } else {
    res.write('不要调皮~~')
    res.end()
  }
}

exports.route = route