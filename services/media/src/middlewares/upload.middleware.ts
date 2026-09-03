import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "shared";

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(new AppError(400, "Only image files are allowed!"));
      return;
    }

    cb(null, true);
  }
}).single("image");

export function uploadMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  uploadImage(req, res, (err: unknown) => {
    if (!err) return next();

    if (err instanceof AppError) return next(err);

    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "LIMIT_FILE_SIZE"
    ) {
      return next(new AppError(400, "File size exceeds the limit of 10MB"));
    }

    return next(new AppError(400, "An error occurred during file upload"));
  });
}
