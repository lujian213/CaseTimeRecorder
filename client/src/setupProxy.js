const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/cases',
    createProxyMiddleware({
      target: 'http://103.119.16.229:9733',
      changeOrigin: true,
    })
  );
};
