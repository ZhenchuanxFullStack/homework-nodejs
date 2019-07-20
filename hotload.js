const path = require('path')
const fs = require('fs')
const process = require('process')
const spawn = require('child_process').spawn
/**
 * 可以接收三个参数
 * --file: 监听的文件改动会重新reload 这个文件 // 默认./src/app.js
 * --watchDir: 你想监听哪个文件夹下的文件(会递归所有文件) // 默认src
 * --delay: 在--delay时间内保存多次只会执行一次(ms) // 默认2000ms
 */
class MyHotLoad {
  constructor() {
    this.myProcess = null // 已经创建好的子进程(reload前要kill掉，否则会端口占用)
    this['--watchdir'] = 'src' // 要监听的文件里js文件
    this['--file'] = './src/app.js' // 监听的文件改动reload这个文件
    this['--delay'] = 2000  // 默认两秒之内多个文件改动,最后一次改动有效
    this.timer = null
  }
  init() {
    this.setParams()
    this.exec()
    this.deepDir(path.join(__dirname, this['--watchdir']))
  }
  // 需要接收更多参数在p数组里添加key
  // 返回类似: { '--file': './src/app.js', '--watchdir': 'src' }
  setParams() {
    let objKeys = Object.keys(this)
    let arr = process.argv.slice(2)
    arr.reduce((pre, cur) => {
      if (objKeys.indexOf(pre) > -1) {
        this[pre] = cur
      }
    })
  }
  // 遍历目录: 监听src目录下所有文件改动
  deepDir(currentDir) {
    fs.readdir(currentDir, (err, files) => {
      if (err) {console.log(err);return}
      files.forEach(file => {
        fs.stat(path.join(currentDir, file), (err, stat) => {
          if (err) throw err;
          if (stat.isFile()) { // 文件
            this.watch(path.join(currentDir, file))
            // fileArr.push(path.join(currentDir, file))
          } else { // 目录
            this.deepDir(path.join(currentDir, file))
          }
        })
      })
    })
  }
  exec() {
    if (this.myProcess) { // 结束掉上一个进程，因为端口相同会报错
      this.myProcess.kill('SIGKILL')
    }
    this.myProcess = spawn('node', [this['--file']])

    // 捕获stdout和stderr(否则监听文件里的日志打印和报错显示不出来)
    // 这里返回的是buffer
    // 坑: windows下竟然执行两次
    this.myProcess.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    // 监听的文件出错会执行
    this.myProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    // this.myProcess.kill()会触发这个事件
    this.myProcess.on('close', (err) => {
      err && console.log(err)
    })
  }
  // 2s内修改了多个文件只会执行一次
  watch(file) {
    fs.watch(file, () => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.log('reload...')
        this.exec()
      }, this['--delay']);
    })
  }
}
new MyHotLoad().init()