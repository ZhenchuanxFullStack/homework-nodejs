const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

class HotLoader {
	static getInstance() {
		if (!HotLoader.instance) {
			HotLoader.instance = new HotLoader();
		}
		return HotLoader.instance;
	}
	constructor() {}

	run(program) {
		this.commander = program;
		fs.watch(path.resolve(this.commander.application), (event, filename) => {
			this.restartProcess();
		});
		this.startProgress();
	}

	startProgress() {
		this.process = spawn("node", [this.commander.application]);
		this.process.stdout.on("data", data => {
			console.log(data.toString());
		});
		this.process.stderr.on("data", data => {
			console.log(data.toString());
		});
	}

	restartProcess() {
		if (this.process !== null) {
			try {
				this.process.kill("SIGKILL");
			} catch (error) {
				console.log(error.message);
			}
		}
		this.startProgress();
	}
}

module.exports = HotLoader.getInstance();
