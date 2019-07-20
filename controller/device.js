const DeviceService = require("../service/device");

class DeviceController {
  static async device(ctx, next) {
    const cpu = DeviceService.getCpuStatus();
    const memo = DeviceService.getMemUsage();
    const ps = await DeviceService.getProcessList();

    ctx.body = {
      cpu,
      memo,
      ps
    };
  }
}

module.exports = DeviceController;
