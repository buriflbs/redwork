const { createProxyMiddleware } = require("http-proxy-middleware");

/**
 * Dev-only: browser always calls same-origin /api.
 * Webpack forwards those requests to the FastAPI backend.
 */
module.exports = function setupProxy(app) {
  const target = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8001";
  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      logLevel: "warn",
    })
  );
};
