const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://law-ai.top',
      changeOrigin: true,
      secure: false,          // allow self-signed/less strict TLS
      xfwd: true,             // add X-Forwarded-* headers
      logLevel: 'debug',      // verbose logs in terminal for troubleshooting
      proxyTimeout: 30000,
      timeout: 30000,
      // If backend already includes /api in its routes, keep as-is; otherwise uncomment:
      // pathRewrite: { '^/api': '' },
      onError(err, req, res) {
        console.error('Proxy error:', err?.code || err?.message || err);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify({ message: 'Proxy error', error: String(err?.code || err?.message || err) }));
      },
    })
  );
};
