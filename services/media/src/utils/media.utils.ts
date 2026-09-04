import type { Attachment, PublicAttachment } from "./types";

export function convertToPublicAttachment(
  attachment: Attachment
): PublicAttachment {
  return {
    id: attachment.id,
    taskId: attachment.task_id,
    imageUrl: attachment.image_url,
    publicId: attachment.public_id,
    uploadedBy: attachment.uploaded_by,
    createdAt: attachment.created_at
  };
}
