import type { Request, Response, NextFunction } from "express";
import { requireIdentity, successResponse, UserRole } from "shared";

import * as mediaService from "../services/media.services";

export async function uploadAttachment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, role } = requireIdentity(req);
    const taskId = String(req.params.taskId);

    const attachment = await mediaService.uploadAttachment({
      taskId,
      userId,
      role: role as UserRole,
      file: req.file
    });

    return successResponse(res, { attachment }, 201);
  } catch (error) {
    next(error);
  }
}
