import {
  Request,
  Response,
  NextFunction,
} from 'express'
import jwt from 'jsonwebtoken'

declare module 'express-serve-static-core' {
  interface Request {
    id?: number
  }
}

interface JwtPayload {
  id: number
}

export const authorization = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'ไม่พบ Token' });
  }

  const token = authHeader.split(' ')[1]

  try {
    const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload
    // console.log('decode.id', decode)
    req.id = decode.id
    next()
  } catch (error) {
    console.log('error', error)
  }
}