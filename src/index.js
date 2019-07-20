const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const routers = require('./router')

const router = new Router();
router.get('/device', routers.device)
app.use(router.routes())
console.log('opend: http://localhost:3000')
app.listen(3000);