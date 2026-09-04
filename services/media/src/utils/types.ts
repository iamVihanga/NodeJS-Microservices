export type Attachment = {
  id: string;
  task_id: string;
  image_url: string;
  public_id: string;
  uploaded_by: string;
  created_at: Date;
};

export type PublicAttachment = {
  id: string;
  taskId: string;
  imageUrl: string;
  publicId: string;
  uploadedBy: string;
  createdAt: Date;
};

export type CreateAttachmentInput = {
  taskId: string;
  imageUrl: string;
  publicId: string;
  uploadedBy: string;
};
