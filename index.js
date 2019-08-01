const http = require("http");
const config = require("./config.js");
const device = require("./device.js");

http
	.createServer(async (req, res) => {
		const parsedReq = device.requestParse(req),
			query = Object.assign({}, config.query, parsedReq.query);
		let data = {};

		if (parsedReq.path === "/device") {
			res.statusCode = 200;
			res.setHeader("content-type", "application/json");
			data = await device.getData(query);
			try {
				data = JSON.stringify(data);
			} catch (err) {
				data = "{}";
			}
			res.end(data);
		}

		res.statusCode = 404;
		res.setHeader("content-type", "text/html");
		res.end("<h1>404</h1>");
	})
	.listen(config.server.port, config.server.host, () => {
		const svr = config.server;
		console.log(`server is running at ${svr.host} : ${svr.port}`);
	});
