const os = require("os");
const util = require("util");
const querystring = require("querystring");
const exec = util.promisify(require("child_process").exec);

/* 获取系统信息 */
const getData = async function(opt) {
  const cpu = await getInfo("cpu"),
    mem = await getInfo("mem"),
    proc = await getInfo("proc", opt);

  return {
    cpu,
    mem,
    proc
  };
};

const getInfo = async function(type, opt) {
  const command = getCommand(type, opt);
  const { stdout, stderr } = await exec(command);
  if (stderr) throw stderr;
  return stdout.split("\n").slice(1, -1);
};

const getCommand = function(type, opt) {
  // 非linux系统时，命令暂时瞎写
  const commands =
    os.platform() == "linux"
      ? {
          cpu: "cat /proc/cpuinfo",
          mem: "cat /proc/meminfo"
        }
      : {
          cpu: "ls -l",
          mem: "ls -al",
          proc: "ps aux | head -n 5"
        };

  if (os.platform() == "linux" && type === "proc")
    commands.proc = `ps aux --sort=${opt.sort === "asce" ? "" : "-"}%${
      opt.keyword
    } | head -n ${opt.len - 0 + 1}`;

  return commands[type];
};

const requestParse = function(req) {
  const [host, port] = req.headers.host.split(":"),
    urlObj = req.url.indexOf("?") === -1 ? [req.url, null] : req.url.split("?"),
    urlPath = /.+\/$/.test(urlObj[0])
      ? urlObj[0].substr(0, urlObj[0].length - 1)
      : urlObj[0],
    urlQuery = urlObj[1] === null ? {} : querystring.parse(urlObj[1]);

  return {
    method: req.headers.method,
    host: host[0],
    port: port[1] || 80,
    path: urlPath,
    query: urlQuery
  };
};

module.exports = {
  getData,
  requestParse
};
