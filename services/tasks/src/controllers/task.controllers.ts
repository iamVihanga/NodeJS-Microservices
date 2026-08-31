import type { Request, Response, NextFunction } from "express";
import * as taskService from "../services/task.services";
import { requireIdentity } from "../utils/task.utils";
import { successResponse } from "shared";

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = requireIdentity(req);

    const task = await taskService.createTask(req.body, userId);

    return successResponse(res, { task }, 201);
  } catch (error) {
    next(error);
  }
}
