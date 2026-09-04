import { config as dotenvConfig } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  requireGatewaySecret,
  successResponse
} from "shared";

import mediaRoutes from "./routes/media.routes";

// Dotenv Configurations
dotenvConfig({ path: resolve(process.cwd(), ".env") });
dotenvConfig({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.MEDIA_PORT || 3003;

const app = express();

// Middlewares, Healthcheck etc.
app.use(httpLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  successResponse(res, { service: "media-service" });
});

app.use("/tasks", requireGatewaySecret, mediaRoutes);

app.use((_req, _res, next) => {
  next(new AppError(400, "Resource not found"));
});

app.use(errorHandler);

// Server Setup
app.listen(PORT, () => {
  logger.info(`[Media Service] has started on ${PORT}`);
});
