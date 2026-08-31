import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(5, "Title is required")
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
