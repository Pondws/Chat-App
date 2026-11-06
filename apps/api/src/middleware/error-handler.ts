import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { HttpError } from '../lib/http-error'

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    })
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message })
  }

  // malformed JSON body from express.json()
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'รูปแบบ JSON ไม่ถูกต้อง' })
  }

  console.error(err)
  return res.status(500).json({ message: 'Internal server error' })
}
