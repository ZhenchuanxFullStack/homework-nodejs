const express = require('express');
const path = require('path');
const os = require('os');
const exec = require('child_process').exec;
const app = express();

const arr = [];

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
  if (req.method.toLowerCase() == 'options') res.send(200);
  else {
    next();
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/device', (req, res) => {
  console.log(0);
  res.send({
    cpus: os.cpus(),
    os: `${os.platform()} -- ${os.release()} -- ${os.type()}`,
    memory: os.totalmem(),
    process: arr
  });
});

app.listen(8080, () => {
  console.log(`app listening at port 8080`);
});

const cmd = process.platform == 'win32' ? 'tasklist' : 'ps aux';

exec(cmd, function(err, stdout, stderr) {
  if (err) {
    return console.log(err);
  }
  stdout.split('\n').filter(function(line) {
    let p = line.trim().split(/\s+/),
      pname = p[0],
      pid = p[1];
    if (p[4]) {
      var pmem = p[4].split(',').join('');
    }
    if (Number(pid) > 0) {
      arr.push([pname, pid, pmem]);
    }
  });
  arr.sort(function(a, b) {
    return Number(b[2]) - Number(a[2]);
  });
});
