const router = require('koa-router')()
const device = require('../controllers/device')

router.prefix('/device')

router.get('/', async (ctx) => {
  const processList = await device.getProcessInfo()
  const data = {
    memory: device.getMemoryInfo(),
    cpus: device.getCpuInfo(),
    processList
  }
  
  ctx.response.body = {
    status: 200,
    msg: '服务器的 CPU、内存状态、进程列表',
    data: data
  }
})


module.exports = router
