const Koa = require('koa');
const Router = require('koa-router');
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const app = new Koa();
const router = new Router();

console.log('@@adasdas');
// 路由
router.get('/device', async (ctx, next) => {
  try {
    const data = await getSysInfo();
    ctx.body = {
      status: 0,
      data,
    };
  } catch (error) {
    ctx.body = {
      status: 1,
      message: err.message,
    }
  }
  next();
});

async function getSysInfo() {
  const cpu = await getInfoByPath('/proc/cpuinfo');
  const mem = await getInfoByPath('/proc/meminfo');
  const psInfo = await getInfoByPs(20);

  return {
    cpu,
    mem,
    psInfo,
  }
}

async function getInfoByPath (path) {
  if (typeof path !== 'string') {
    return
  }

  const {stdout, stderr} = await exec(`cat ${path}`);

  if (stderr) {
    return
  }
  const rst = {};
  stdout.split('\n').forEach(line => {
    const [key, value] = line.replace(/[\s]+/g, ' ').split(':');
    rst[key] = value;
  });

  return rst;
}

async function getInfoByPs (nums) {
  const execStr = `ps aux --sort=-%cpu | head -n ${nums}`
  const {stdout, stderr} = await exec(execStr);
  if (stderr) {
    return
  }
  const lines = stdout.split('\n').filter(line => line);
  const keys = lines[0].replace(/[\s]+/g, ' ').split(' ').filter(key => key);
  return lines.slice(1).map(line => {
    const values = line.replace(/[\s]+/g, ' ').split(' ');
    const rst = {};
    values.forEach((value, idx) => {
      if (!keys[idx]) {
        return
      }
      rst[keys[idx]] = value;
    });
    return rst;
  });
}

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);