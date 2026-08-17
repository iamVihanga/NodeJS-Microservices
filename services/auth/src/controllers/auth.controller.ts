import type { Request, Response, NextFunction } from "express";

import * as authService from "../services/auth.service";
import { successResponse } from "shared";

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
