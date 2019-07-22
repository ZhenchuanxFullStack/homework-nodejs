const spawn = require('child_process').spawn;
const watch = require('watch');
const args = process.argv;
const path = require('path');
let entry = path.resolve(process.cwd(), args[2]);
let cp = null;

function start (path) {
  const child = spawn('node', [path]);

  child.stdout.on('data', function (data) {
    console.log(`[stdout] ${data}`);
  });

  child.stderr.on('data', function (data) {
    console.log(`[error] ${data}`);
  });

  return child;
}

watch.createMonitor(process.cwd(), function (monitor) {
  monitor.files[entry]
  monitor.on("changed", function (f, curr, prev) {
    // 只监听启动文件
    if(f !== entry) return
    console.log('文件已经变动，重新启动程序')
    cp.kill()
    cp = start(entry)
  })
})

console.log('app is running.')
console.log('[path] ', entry);
cp = start(entry) 