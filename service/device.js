const process = require("process");
const child_process = require("child_process");

class DeviceService {
  // 获取CPU状态
  static getCpuStatus() {
    return process.cpuUsage();
  }

  // 获取内存使用情况
  static getMemUsage() {
    return process.memoryUsage();
  }

  // 获取进程列表，并按照CPU使用率排序
  static async getProcessList() {
    const command = `ps aux`;
    const { stdout, stderr } = await child_process.exec(command);

    return stdout;
  }
}
module.exports = DeviceService;
