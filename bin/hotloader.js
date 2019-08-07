const {
  spawn
} = require("child_process");
const fs = require("fs");
const path = require("path");

class HotLoader {
  constructor(args, extName, launcher) {
    this.args = args;
    this.extName = extName;
    this.launcher = launcher;
    this.passedArguments = this.args.slice(2);
  }

  run() {
    fs.watch(
      path.join(process.cwd(), this.passedArguments[0]),
      (event, filename) => {
        this.restartProcess();
      }
    );
    return this.startProcess();
  }

  startProcess() {
    this.process = spawn(this.launcher, this.passedArguments, {
      env: process.env
    });

    this.process.stdout.on("data", data => {
      console.log(data.toString());
    });
  }

  restartProcess() {
    if (this.process !== null) {
      try {
        this.process.kill("SIGKILL");
      } catch (error) {
        console.log("Exception: " + error.message, "bad");
      }
    }

    this.startProcess();
  }
}

exports.HotLoader = HotLoader;