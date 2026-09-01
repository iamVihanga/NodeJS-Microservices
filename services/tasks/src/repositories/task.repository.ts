import { AppError, getPool } from "shared";
import type { CreateTaskInput, ListTasksInput, Task } from "../utils/types";
import { UpdateTaskSchema } from "../schemas/task.schemas";

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const result = await getPool().query<Task>(
    `
        INSERT INTO tasks (title, created_by)
        VALUES ($1, $2)
        RETURNING id, title, status, created_by, created_at, updated_at
    `,
    [input.title, input.createdBy]
  );

  return result.rows[0];
}

export async function listTasks(input: ListTasksInput): Promise<Task[]> {
  if (input.role === "ADMIN") {
    const result = await getPool().query<Task>(
      `
            SELECT id, title, status, created_by, created_at, updated_at
            FROM tasks
            ORDER BY created_at DESC
        `
    );

    return result.rows;
  }

  const result = await getPool().query<Task>(
    `
            SELECT id, title, status, created_by, created_at, updated_at
            FROM tasks
            WHERE created_by = $1
            ORDER BY created_at DESC
        `,
    [input.userId]
  );

  return result.rows;
}

export async function findTaskById(id: string): Promise<Task | null> {
  const result = await getPool().query<Task>(
    `
            SELECT id, title, status, created_by, created_at, updated_at
            FROM tasks
            WHERE id = $1
        `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function deleteTaskById(id: string): Promise<boolean> {
  const result = await getPool().query(`DELETE FROM tasks WHERE id = $1`, [id]);

  return (result.rowCount ?? 0) > 0;
}

export async function updateTaskById(id: string, input: UpdateTaskSchema) {
  const { rows } = await getPool().query<Task>(
    `
      UPDATE tasks
      SET title       = COALESCE($1, title),
          status      = COALESCE($2, status),
          updated_at  = NOW()
      WHERE id = $3
      RETURNING *;
    `,
    [input.title ?? null, input.status ?? null, id]
  );

  if (rows.length < 1) {
    throw new AppError(404, "Task not found");
  }

  return rows[0];
}
