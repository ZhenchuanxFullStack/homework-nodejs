const os = require('os');
const http = require('http');
const { exec } = require('child_process');
const port = '9000';
// Linux服务器使用命令：
// free -m 查询cpu/内存状态
// ps aux -r 查询进程列表
// Mac 可使用top -o cpu
function getProcessStatus() {
  return new Promise((resolve, reject) => {
    exec('ps aux -r', (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    })
  })
}
const server = http.createServer(async (req, res) => {
  // 通常应该额外配置一个文件单独处理路由表，这里偷懒一下
  if (req.url.indexOf('/device') == 0) {
    res.writeHeader(200, { 'Content-Type': 'text/html' });
    let msg = `<h2>内存状态: + ${os.freemem() / 1024 / 1024}MB</h2>
  <h2>CPU: ${os.arch()}</h2>`;
    await getProcessStatus().then(res => { msg += `<p>${res}</p>` })
    res.write('<head><meta charset="utf-8"/></head>')
    res.write(`<body>${msg}</body>`)
    res.end();
  } else if (req.url.indexOf('/hotnode') == 0) {
    res.writeHeader(200, { 'Content-Type': 'text/html' });
    // res.end('before hot!!!!!!');
    res.end('after hot!!!!!!');
  } else {
    res.statusCode = 404
    res.end()
  }
}).listen(port);
