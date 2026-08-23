import type { Request, Response, NextFunction } from "express";

import * as authService from "../services/auth.service";
import { AppError, successResponse } from "shared";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await authService.register(req.body);

    return successResponse(res, { user }, 200);
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.header("x-user-id");

    if (!userId) throw new AppError(401, "Missing Header: x-user-id");

    const result = await authService.getMe(userId);

    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
}
