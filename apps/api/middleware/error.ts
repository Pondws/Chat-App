import {
  Request,
  Response,
  NextFunction,
} from 'express'
import { ZodError } from 'zod'
import { AppError } from '../src/utils/app-error'

// Express 5: ถ้า async handler throw error จะถูกส่งมาที่นี่อัตโนมัติ
// จึงไม่ต้องเขียน try/catch ซ้ำในทุก controller
// (error middleware ต้องมี 4 parameter เสมอ Express จึงจะรู้ว่าเป็นตัวจัดการ error)
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ข้อมูลไม่ผ่าน validation ของ zod -> 400 พร้อมบอกว่า field ไหนผิด
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  // error ที่ไม่ได้คาดไว้ -> log ไว้ดู แต่ไม่ส่งรายละเอียดให้ client
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
}
