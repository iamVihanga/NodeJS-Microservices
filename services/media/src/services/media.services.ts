import { AppError, UserRole } from "shared";
import * as mediaRepository from "../repositories/media.repository";
import { uploadBuffer } from "../utils/storage";
import { convertToPublicAttachment } from "../utils/media.utils";

interface UploadAttachmentInput {
  taskId: string;
  userId: string;
  role: UserRole;
  file?: Express.Multer.File;
}

export async function uploadAttachment(input: UploadAttachmentInput) {
  if (!input.file) throw new AppError(400, "Image file is required");

  // --- Check Access ---
  const taskAccess = await mediaRepository.getTaskAccess(input.taskId);

  if (!taskAccess) throw new AppError(404, "Task not found");

  if (input.role !== "ADMIN" && taskAccess.created_by !== input.userId) {
    throw new AppError(
      403,
      "You do not have permission to upload attachments for this task"
    );
  }

  // --- Upload to Cloudflare R2 ---
  const uploaded = await uploadBuffer(
    input.file.buffer,
    input.file.mimetype || "image/jpeg"
  );

  // --- Save to Database ---
  const attachment = await mediaRepository.createAttachment({
    taskId: input.taskId,
    publicId: uploaded.publicId,
    imageUrl: uploaded.imageUrl,
    uploadedBy: input.userId
  });

  return convertToPublicAttachment(attachment);
}
