import { randomUUID } from 'node:crypto'
import jwt from 'jsonwebtoken'
import { env } from '../lib/env'

export interface TokenPayload {
  id: number
  email: string
}

export const ACCESS_TOKEN_TTL = '15m'
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

const toPayload = (decoded: string | jwt.JwtPayload): TokenPayload => {
  if (typeof decoded === 'string' || typeof decoded.id !== 'number') {
    throw new jwt.JsonWebTokenError('invalid payload')
  }
  return { id: decoded.id, email: decoded.email }
}

const JWTGenerate = {
  accessToken: ({ id, email }: TokenPayload) =>
    jwt.sign({ id, email }, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL }),

  // jwtid makes every refresh token unique, so each one can be tracked/revoked in the DB
  refreshToken: ({ id, email }: TokenPayload) =>
    jwt.sign({ id, email }, env.JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_TTL_MS / 1000,
      jwtid: randomUUID(),
    }),

  verifyAccessToken: (token: string) => toPayload(jwt.verify(token, env.JWT_ACCESS_SECRET)),

  verifyRefreshToken: (token: string) => toPayload(jwt.verify(token, env.JWT_REFRESH_SECRET)),
}

export default JWTGenerate
