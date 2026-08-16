import { Response } from "express";

export function successResponse(
  res: Response,
  data: unknown,
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

export function failResponse(
  res: Response,
  message: string,
  statusCode: number = 400
) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}
