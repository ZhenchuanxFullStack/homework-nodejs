const koa = require('koa2')
const fs = require('fs')
const Router = require('koa-router')

const app = new koa()
const router = new Router()

const PORT = 5000

// 首页
app.use(async (ctx, next) => {
  if (ctx.request.path === '/') {
    ctx.response.status = 200
    ctx.response.body = `Server is on port ${PORT}`
  }
  await next()
})

// 其他页面通过 router 加载
let routers = fs.readdirSync(__dirname + '/routers')
routers.forEach((element) => {
  let module = require(__dirname + '/routers/' + element)
  /*
    routers 下面的每个文件负责一个特定的功能，分开管理
    通过 fs.readdirSync 读取 routers 目录下的所有文件名，挂载到 router 上面
  */
  router.use('/' + element.replace('.js', ''), module.routes(), module.allowedMethods())
})
app.use(router.routes())

console.log(`Server is on port ${PORT}`)

app.listen(PORT)
