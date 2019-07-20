const tools = require('../tools')
const os = require('os')
module.exports.device = async function (ctx, next) {
  let systemInfo = {
    '系统类型': os.platform(),
    'CPU型号': os.cpus()[0].model,
    '总内存': (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
    '空闲内存': (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
  const processList = await tools.getProcessList()
  ctx.body = {
    systemInfo,
    processList
  }
}
