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
