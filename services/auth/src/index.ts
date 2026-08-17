import { config as dotenvConfig } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse
} from "shared";

import authRoutes from "./routes/auth.routes";

// Dotenv Configurations
dotenvConfig({ path: resolve(process.cwd(), ".env") });
dotenvConfig({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.AUTH_PORT || 3001;

const app = express();

// Middlewares, Healthcheck etc.
app.use(httpLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  successResponse(res, { service: "auth-service" });
});

app.use("/auth", authRoutes);

app.use((_req, _res, next) => {
  next(new AppError(400, "Resource not found"));
});

app.use(errorHandler);

// Server Setup
app.listen(PORT, () => {
  logger.info(`[Auth Service] has started on ${PORT}`);
});
