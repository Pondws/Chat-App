import { ErrorRequestHandler } from "express"
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "ข้อมูลไม่ถูกต้อง",
      errors: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  return res.status(500).json({ message: "เกิดข้อผิดพลาด" })
}