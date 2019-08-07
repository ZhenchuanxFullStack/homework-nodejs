const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const PORT = 4000;

const systemInfo = {
    '系统类型': os.platform(),
    'CPU型号': os.cpus()[0].model,
    '总内存': (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
    '空闲内存': (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
};

router.get('/', async (ctx, next) => {
    await next();
    ctx.body = "Hello Koa";
})
router.get('/device', async (ctx, next) => {
    await next();
    ctx.body = "device Koa";
});

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`listening ${PORT}`);
});