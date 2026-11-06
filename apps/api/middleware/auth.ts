import {
  Request,
  Response,
  NextFunction,
} from 'express'
import JWTGenerate from '../src/jwt/jwt'

declare module 'express-serve-static-core' {
  interface Request {
    id?: number
  }
}

// ตรวจ access token จาก header: Authorization: Bearer <token>
export const authorization = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'ไม่พบ Token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = JWTGenerate.verifyAccessToken(token)
    req.id = decoded.id
    next()
  } catch {
    // ต้องตอบกลับเสมอ ไม่อย่างนั้น request จะค้าง
    // frontend จะเห็น 401 แล้วไปเรียก /auth/refresh เอง
    return res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  }
}
