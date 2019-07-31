module.exports = {
  // 服务器配置
  server: {
    host: "127.0.0.1",
    port: 3000
  },
  //   默认参数
  query: {
    sort: "asce", // Asce升序，desc降序
    keyword: "cpu", // cpu/mem/pid/start
    len: 10 // 显示条数
  }
};
