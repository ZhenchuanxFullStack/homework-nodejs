
var os = require("os");
var exec = require('child_process').exec;
var express = require('express');
var app = express();

var progressList = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.get('/device',function(req, res){
    res.send({
        cpus: os.cpus(),
        memory: os.totalmem(),
        process: progressList
    })
})

app.listen(8087,function(){
    console.log('Server listen on 8087!')
})

const cmd = process.platform == 'win32' ? 'tasklist' : 'ps aux';

exec(cmd, function(error, stdout, stderr){
    if(error){
        console.log(`执行的错误：${error}`)
        return;
    }
    stdout.split('\n').filter(function(line) {
        let p = line.trim().split(/\s+/),
          user = p[0],
          pid = p[1],
          pmem = p[4];
        
        if (Number(pid) > 0) {
          progressList.push([user, pid, pmem]);
        }
    });
    progressList.sort(function(a, b) {
        return Number(b[2]) - Number(a[2]);
    });
    console.log(`stderr: ${stderr}`);
})