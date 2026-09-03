import { AppError, UserRole } from "shared";
import * as mediaRepository from "../repositories/media.repository";

interface UploadAttachmentInput {
  taskId: string;
  userId: string;
  role: UserRole;
  file?: Express.Multer.File;
}

export async function uploadAttachment(input: UploadAttachmentInput) {
  if (!input.file) throw new AppError(400, "Image file is required");

  const taskAccess = await mediaRepository.getTaskAccess(input.taskId);

  if (!taskAccess) throw new AppError(404, "Task not found");

  if (input.role !== "ADMIN" && taskAccess.created_by !== input.userId) {
    throw new AppError(
      403,
      "You do not have permission to upload attachments for this task"
    );
  }
}
