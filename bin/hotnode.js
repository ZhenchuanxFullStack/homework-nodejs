const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const file = path.resolve('./') + '\\app.js';

//第一次启动 , 记录pid
let pNode = exec('node app.js');
console.log(pNode);
console.log(`服务已启动 , 当前id : ${pNode.pid}`);
fs.watch(file, (eventType, filename) => {
  if (filename && eventType === 'change') {
    console.log(` ${filename} 已更改 ， 重启中..`);
    pNode.kill();
    pNode = exec('node app.js');
    console.log(` 新的id : ${pNode.pid} `);
  } else {
    console.log('没change ， 或没文件名');
  }
});
