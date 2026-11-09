import {
  Request,
  Response,
  NextFunction
} from "express"

import JWTGenerate from "../lib/jwt"

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    const payload = JWTGenerate.verifyAccessToken(token)

    if (typeof payload === "string" || !payload.id || !payload.role) {
      return res.status(401).json({ message: "Invalid token" })
    }
    req.user = { id: payload.id, email: payload.email, role: payload.role }

    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    })
  }
}


export default authMiddleware