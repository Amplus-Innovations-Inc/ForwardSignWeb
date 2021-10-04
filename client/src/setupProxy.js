const { createProxyMiddleware } = require("http-proxy-middleware");
const { backendHost } = require("./config");

module.exports = function (app) {
  console.log("setup proxy");
  app.use(
    "/api",
    createProxyMiddleware({
      target: backendHost,
      changeOrigin: true,
      secure: false,
    })
  );
};
