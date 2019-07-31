# tast

写一个 web 服务,提供以下服务：  
GET 接口 `/device?pw=cpu&sort=desc`，返回：

```js
{
    cpu:{}, // 服务器cpu状态
    mem:{}, // 服务器内存状态
    proc:[] // 全量进程列表（默认按cpu和降序排列）
}
```

写一个守护进程：  
同目录下写一个 bin/hotnode 最终通过`hotnode app.js`启动服务。  
并在 app.js 文件变更后自动重启 app.js 进程

## 