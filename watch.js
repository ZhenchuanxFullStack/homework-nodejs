const fs = require('fs')
const path = require('path')
const {spawn} = require('child_process')

class Watcher{
  constructor() {
    this.myProcess = null // 已经创建好的子进程(reload前要kill掉，否则会端口占用)
    this.watchDir = './' // 要监听的文件里js文件
    this.watchFile = './app.js' // 监听的文件改动reload这个文件
    this.delay = 2000  // 默认两秒之内多个文件改动,最后一次改动有效
    this.timer = null
    this.ignore = ['node_modules', '.git']
  }
  init() {
    this.exec()
    this.deepDir(path.join(__dirname, this.watchDir))
  }

  // 遍历目录: 监听src目录下所有文件改动
  deepDir(currentDir) {
    fs.readdir(currentDir, (err, files) => {
      if (err) {
        console.log(err);
        return false
      }
      let ignoreArr = this.ignore.filter(item => {
        return currentDir.indexOf(item) === -1
      })

      if (ignoreArr === 0) {
        console.log('此为忽略目录')
        return false
      }

      files.forEach(file => {
        // 获取文件状态
        fs.stat(path.join(currentDir, file), (err, stat) => {
          if (err) throw err;
          if (stat.isFile()) { 
            this.watch(path.join(currentDir, file))
          } else { 
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
    this.myProcess = spawn('node', [this.watchFile])

    // 捕获stdout和stderr(否则监听文件里的日志打印和报错显示不出来)
    // 这里返回的是buffer
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
  watch(file) {
    fs.watch(file, () => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.log('reload...')
        this.exec()
      }, this.delay);
    })
  }
}
new Watcher().init()