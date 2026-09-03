import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

import * as mediaControllers from "../controllers/media.controller";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/:taskId/attachments",
  uploadMiddleware,
  mediaControllers.uploadAttachment
);

export default router;
