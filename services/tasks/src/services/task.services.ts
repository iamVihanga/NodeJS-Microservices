import { CreateTaskSchema } from "../schemas/task.schemas";
import * as taskRepository from "../repositories/task.repository";
import { PublicTask } from "../utils/types";
import { convertToPublicTask } from "../utils/task.utils";
import { AppError, UserRole } from "shared";

export async function createTask(input: CreateTaskSchema, userId: string) {
  const newTask = await taskRepository.createTask({
    title: input.title,
    createdBy: userId
  });

  return convertToPublicTask(newTask);
}

export async function listTasks(userId: string, role: UserRole) {
  if (!userId || !role) throw new AppError(401, "Missing User Identity");

  const tasks = await taskRepository.listTasks({ role, userId });

  return tasks.map(convertToPublicTask);
}

export async function getTask(id: string, userId: string, role: UserRole) {
  const task = await taskRepository.findTaskById(id);

  if (!task) throw new AppError(404, "Task not found");

  if (role !== "ADMIN" && task.created_by !== userId) {
    throw new AppError(403, "Forbidden");
  }

  return convertToPublicTask(task);
}

export async function deleteTask(id: string, userId: string, role: UserRole) {
  const existingTask = await taskRepository.findTaskById(id);

  if (!existingTask) throw new AppError(404, "Task not found");

  if (role !== "ADMIN" && existingTask.created_by !== userId) {
    throw new AppError(403, "Forbidden");
  }

  return await taskRepository.deleteTaskById(id);
}
