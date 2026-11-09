import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken"
import { AuthUser } from "../modules/auth/auth.types"

const secret = process.env.JWT_ACCESS_SECRET
if (!secret) throw new Error("JWT_ACCESS_SECRET is not set")

const signOptions: SignOptions = {
  algorithm: "HS256",
  expiresIn: "15m",
}

const verifyOptions: VerifyOptions = {
  algorithms: ["HS256"],
}

const JWTGenerate = {
  accessToken: (payload: AuthUser): string => {
    return jwt.sign(payload, secret, signOptions)
  },

  verifyAccessToken: (token: string): string | JwtPayload => {
    return jwt.verify(token, secret, verifyOptions)
  },
}

export default JWTGenerate