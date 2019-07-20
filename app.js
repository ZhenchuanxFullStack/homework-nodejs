const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
var router = new Router();

const DeviceController = require("./controller/device");

router.get("/device", DeviceController.device);

app.use(router.routes()).use(router.allowedMethods());

console.log(0);
app.listen(7001, () => {
  console.log("server is running at 7001");
});
