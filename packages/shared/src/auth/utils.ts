import type { Request } from "express";
import { AppError } from "../errors/AppError";

export function requireIdentity(req: Request) {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!role || !userId) {
    throw new AppError(401, "[Unauthroized] - Missing user identities");
  }

  return { userId, role };
}
