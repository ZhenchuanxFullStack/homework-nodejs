const process = require("process");
const { spawn } = require("child_process");

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
    return new Promise((resolve, reject) => {
      // linux
      // const command = `ps`;
      // const options = ["-aux --sort -pcpu"];

      // Mac
      const command = `ps`;
      const options = ["aux"];
      const child = spawn(command, options);

      let chunks = [];

      child.stdout.on("data", data => {
        chunks.push(data);
      });

      child.stdout.on("close", () => {
        const resString = Buffer.concat(chunks).toString();
        resolve(resString.split("\n"));
      });
    });
  }
}
module.exports = DeviceService;
