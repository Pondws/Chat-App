import { createHash } from 'node:crypto'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'
import authSchema, { LoginInput, RegisterInput } from './auth.validation'
import JWTGenerate, { REFRESH_TOKEN_TTL_MS, TokenPayload } from '../../jwt/jwt'
import { HttpError } from '../../lib/http-error'

const INVALID_CREDENTIALS = 'อีเมล์หรือรหัสผ่านไม่ถูกต้อง'
const INVALID_REFRESH_TOKEN = 'Refresh token ไม่ถูกต้องหรือหมดอายุ'

const publicUser = { id: true, email: true, name: true } as const

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

const issueTokens = async (payload: TokenPayload) => {
  const accessToken = JWTGenerate.accessToken(payload)
  const refreshToken = JWTGenerate.refreshToken(payload)

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: payload.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  })

  return { accessToken, refreshToken }
}

const authService = {
  register: async (input: RegisterInput) => {
    const { password, ...rest } = authSchema.register.parse(input)

    const existingUser = await prisma.user.findUnique({ where: { email: rest.email } })
    if (existingUser) {
      throw new HttpError(409, 'มีผู้ใช้ในระบบแล้ว')
    }

    return prisma.user.create({
      data: { ...rest, password: await bcrypt.hash(password, 10) },
      select: publicUser,
    })
  },

  login: async (input: LoginInput) => {
    const { email, password } = authSchema.login.parse(input)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpError(401, INVALID_CREDENTIALS)
    }

    const tokens = await issueTokens({ id: user.id, email: user.email })

    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name },
    }
  },

  // Rotates the refresh token: the old one is revoked and a new pair is issued.
  refresh: async (input: unknown) => {
    const { refreshToken } = authSchema.refreshToken.parse(input)

    let payload: TokenPayload
    try {
      payload = JWTGenerate.verifyRefreshToken(refreshToken)
    } catch {
      throw new HttpError(401, INVALID_REFRESH_TOKEN)
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(refreshToken) },
    })

    if (!stored || stored.userId !== payload.id) {
      throw new HttpError(401, INVALID_REFRESH_TOKEN)
    }

    if (stored.revokedAt) {
      // A revoked token being reused means it may have been stolen:
      // revoke every session of this user.
      await prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      })
      throw new HttpError(401, INVALID_REFRESH_TOKEN)
    }

    if (stored.expiresAt <= new Date()) {
      throw new HttpError(401, INVALID_REFRESH_TOKEN)
    }

    // conditional update guards against two concurrent refreshes with the same token
    const { count } = await prisma.refreshToken.updateMany({
      where: { id: stored.id, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    if (count === 0) {
      throw new HttpError(401, INVALID_REFRESH_TOKEN)
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } })
    if (!user) {
      throw new HttpError(401, INVALID_REFRESH_TOKEN)
    }

    return issueTokens({ id: user.id, email: user.email })
  },

  logout: async (input: unknown) => {
    const { refreshToken } = authSchema.refreshToken.parse(input)

    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    })
  },

  logoutAll: async (userId: number) => {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  },
}

export default authService
