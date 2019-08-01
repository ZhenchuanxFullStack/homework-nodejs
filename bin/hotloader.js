const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");
const chokidar = require("chokidar");

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
		const watcher = chokidar
			.watch(".", { ignored: /(^|[\/\\])\../, atomic: 500 })
			.on("change", filepath => {
				console.log(
					"these files has been changed:\n",
					path.resolve(__dirname, filepath),
					"\n"
				);
				this.restartProcess();
			});
		this.startProgress();
	}

	startProgress() {
		this.process = exec(`node ${this.commander.application}`);
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
