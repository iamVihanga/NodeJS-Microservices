import { type UserRole } from "shared";

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  created_by: string;
  created_at: Date;
  updated_at: Date;
};

export type PublicTask = {
  id: string;
  title: string;
  status: TaskStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTaskInput = {
  title: string;
  createdBy: string;
};

export type ListTasksInput = {
  userId: string;
  role: UserRole;
};
