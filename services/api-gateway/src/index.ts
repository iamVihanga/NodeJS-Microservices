import { config } from "dotenv";
import { resolve } from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit, { MINUTE } from "express-rate-limit";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse
} from "shared";
import { createProxyMiddleware } from "http-proxy-middleware";
import { gatewayAuth } from "./middlewares/gatewayAuth";

// Dotenv Configurations
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

// Constants
const PORT = process.env.PORT || 3000; // This will be the default API Gateway PORT
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const TASK_SERVICE_URL =
  process.env.TASK_SERVICE_URL || "http://localhost:3002";

// Server
const app = express();

app.use(helmet()); // secure default http headers
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: true,
    legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  })
);
app.use(httpLogger);

// Healthcheck
app.use("/health", (_req, res) => {
  successResponse(res, { service: "api-gateway" });
});

// Proxy routes

// 1. Auth Proxy
// -- Forward anything from "http://localhost:3000/auth/*" -> "http://localhost:3001/api/*"
app.use(
  "/auth",
  gatewayAuth,
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/auth${path}`
  })
);

// 2. Task Proxy
// --- Forward anything from "http://localhost:3000/tasks/*" -> "http://localhost:3002/tasks/*"
app.use(
  "/tasks",
  gatewayAuth,
  createProxyMiddleware({
    target: TASK_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/tasks${path}`
  })
);

// Error Catching
app.use((_req, res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

// ---

app.listen(PORT, () => {
  logger.info(`[API Gateway Service] has started on ${PORT}`);
});
