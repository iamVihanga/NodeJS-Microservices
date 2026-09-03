import type { Request, Response, NextFunction } from "express";
import * as taskService from "../services/task.services";
import {
  failResponse,
  successResponse,
  UserRole,
  requireIdentity
} from "shared";

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

export async function listTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, role } = requireIdentity(req);

    const tasks = await taskService.listTasks(userId, role as UserRole);

    return successResponse(res, { tasks });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, role } = requireIdentity(req);
    const id = String(req.params.id);

    const task = await taskService.getTask(id, userId, role as UserRole);

    return successResponse(res, { task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, role } = requireIdentity(req);
    const id = String(req.params.id);

    const deleteResult = await taskService.deleteTask(
      id,
      userId,
      role as UserRole
    );

    if (deleteResult) {
      return successResponse(res, { message: "Task deleted successfully !" });
    }

    return failResponse(res, "Failed to delete task");
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, role } = requireIdentity(req);

    const id = String(req.params.id);
    const body = req.body;

    const updatedTask = await taskService.updateTask(
      id,
      body,
      userId,
      role as UserRole
    );

    return successResponse(res, { task: updatedTask });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
