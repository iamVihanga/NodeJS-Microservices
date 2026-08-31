import type { Request } from "express";
import { PublicTask, Task } from "./types";
import { AppError } from "shared";

export function convertToPublicTask(task: Task): PublicTask {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    createdBy: task.created_by,
    createdAt: task.created_at,
    updatedAt: task.updated_at
  };
}

export function requireIdentity(req: Request) {
  const userId = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!role || !userId) {
    throw new AppError(401, "[Unauthroized] - Missing user identities");
  }

  return { userId, role };
}
