const Koa = require('koa');
const Router = require('koa-router');
const _ = require('lodash');
const ps = require('current-processes');
const os = require('os');

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
    const processes = await new Promise((resolve, reject) => {
        ps.get(function(err, processes) {

            const sorted = _.sortBy(processes, 'cpu');
            const result = sorted.reverse();
            resolve(result);
        });
    })
    ctx.response.status = 200
    ctx.response.body = {
        code: 0,
        success: true,
        data: {
            systemInfo,
            processes
        },
        messege: '请求成功！'
    };
});

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`listening http://localhost:${PORT}/`);
});