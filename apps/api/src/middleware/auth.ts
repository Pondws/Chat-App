import { NextFunction, Request, Response } from 'express'
import JWTGenerate from '../jwt/jwt'

declare module 'express-serve-static-core' {
  interface Request {
    id?: number
  }
}

export const authorization = (req: Request, res: Response, next: NextFunction) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? []

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'ไม่พบ Token' })
  }

  try {
    const payload = JWTGenerate.verifyAccessToken(token)
    req.id = payload.id
    next()
  } catch {
    return res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  }
}
