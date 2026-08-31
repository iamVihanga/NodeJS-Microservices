import { CreateTaskSchema } from "../schemas/task.schemas";
import * as taskRepository from "../repositories/task.repository";
import { PublicTask } from "../utils/types";
import { convertToPublicTask } from "../utils/task.utils";

export async function createTask(input: CreateTaskSchema, userId: string) {
  const newTask = await taskRepository.createTask({
    title: input.title,
    createdBy: userId
  });

  return convertToPublicTask(newTask);
}
