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

import taskRouter from "./routes/tasks.routes";

// Dotenv Configurations
dotenvConfig({ path: resolve(process.cwd(), ".env") });
dotenvConfig({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.TASK_PORT || 3002;

const app = express();

// Middlewares, Healthcheck etc.
app.use(httpLogger);
app.use(express.json());

app.get("/health", (_req, res) => {
  successResponse(res, { service: "task-service" });
});

app.use("/tasks", requireGatewaySecret, taskRouter);

app.use((_req, _res, next) => {
  next(new AppError(400, "Resource not found"));
});

app.use(errorHandler);

// Server Setup
app.listen(PORT, () => {
  logger.info(`[Task Service] has started on ${PORT}`);
});
