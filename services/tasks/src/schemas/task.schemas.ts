import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(5, "Title is required")
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z
  .object({
    title: z.string(),
    status: z.literal(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], {
      error: "Invalid status value"
    })
  })
  .partial();

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
