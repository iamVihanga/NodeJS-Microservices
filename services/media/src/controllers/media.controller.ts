import type { Request, Response, NextFunction } from "express";
import { requireIdentity } from "shared";

export async function uploadAttachment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, role } = requireIdentity(req);
    const taskId = String(req.params.taskId);
  } catch (error) {
    next(error);
  }
}
