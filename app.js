const express = require('express');
const fs = require('fs');
const exec = require('child_process').exec;
const app = express();

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.get('/device', (req, res) => {
    try {
        // 读文件方式
        let cpuBaseInfo = fs.readFileSync("/proc/cpuinfo", { encoding: 'utf8' });
        let cpuInfo = {};
        cpuBaseInfo.replace(/\t/g, '').split('\n').forEach(item => {
            let parts = item.split(': ');
            cpuInfo[parts.shift()] = (parts.join(': ') || '');
        })
        let cpuUseInfo = fs.readFileSync("/proc/stat").toString();
        let cpuUseInfoArray = cpuUseInfo.split('\n')[0].split(' ').map(item => +item);
        cpuInfo.cpuUsedInfo = (100 * (cpuUseInfoArray[2] + cpuUseInfoArray[3] + cpuUseInfoArray[4]) / (cpuUseInfoArray[2] + cpuUseInfoArray[3] + cpuUseInfoArray[4] + cpuUseInfoArray[5])).toFixed(2)

        // 执行命令方式
        let memInfo = {};
        exec(`cat /proc/meminfo`, (error, stdout, stderr) => {
            if (error || stderr) {
                res.send({
                    successs: true,
                    data: { ...cpuInfo, ...{ memInfoError: '获取内存信息异常' } }
                })
            } else {
                stdout.split('\n').forEach(line => {
                    const [key, value] = line.replace(/[\s]+/g, ' ').split(': ');
                    memInfo[key] = +(value.split(' ')[0]);
                });
                res.send({
                    successs: true,
                    data: { ...cpuInfo, ...memInfo, ...{memUsedInfo:(100*(memInfo.MemTotal-memInfo.MemAvailable)/memInfo.MemTotal).toFixed(2)}}
                })
            }

        });

    } catch (e) {
        res.send({
            successs: false,
            data: e
        })
    }
})
app.listen(2333)