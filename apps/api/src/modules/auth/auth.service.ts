import crypto from "node:crypto"
import bcrypt from 'bcrypt'
import { Prisma } from "../../../generated/prisma/client"

import JWTGenerate from '../../lib/jwt'

import { prisma } from '../../lib/prisma'
import {
  RegisterInput,
  LoginInput,
} from './auth.types'
import { AppError } from "../../errors/app-error"

const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000
const DUMMY_HASH = await bcrypt.hash("dummy-password", 12)

const hashToken = (token: string) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")
}

const authService = {
  register: async (user: RegisterInput) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      })

      if (existingUser) {
        throw new Error("มีผู้ใช้ในระบบแล้ว")
      }

      const hashedPassword = await bcrypt.hash(user.password, 12)

      return await prisma.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
          name: user.name,
        },

        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(409, "มีผู้ใช้ในระบบแล้ว")
      }
      throw error
    }
  },
  login: async (data: LoginInput) => {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    const match = await bcrypt.compare(data.password, user?.password ?? DUMMY_HASH)

    if (!user || !match) {
      throw new AppError(401, "อีเมล์หรือรหัสผ่านไม่ถูกต้อง")
    }

    const accessToken = JWTGenerate.accessToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    const refreshToken = crypto.randomBytes(64).toString("hex")

    const tokenHash = hashToken(refreshToken)

    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(
          Date.now() + REFRESH_TOKEN_EXPIRES_IN
        )
      }
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },

      accessToken,
      refreshToken
    }
  },
  refresh: async (data: { refreshToken: string }) => {
    const tokenHash = hashToken(data.refreshToken)

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    })

    if (!storedToken) {
      throw new AppError(401, "Invalid refresh token")
    }

    if (storedToken.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: {
          userId: storedToken.userId,
          revokedAt: null
        },
        data: { revokedAt: new Date() }
      })
      throw new AppError(401, "Refresh token has been revoked")
    }

    if (storedToken.expiresAt < new Date()) {
      throw new AppError(401, "Refresh token has expired")
    }

    const user = storedToken.user
    const newRefreshToken = crypto.randomBytes(64).toString("hex")
    const newTokenHash = hashToken(newRefreshToken)

    await prisma.$transaction(async (tx) => {
      const revoke = await tx.refreshToken.updateMany({
        where: { id: storedToken.id, revokedAt: null },
        data: { revokedAt: new Date() },
      })

      if (revoke.count === 0) {
        throw new AppError(401, "Refresh token has already been used")
      }

      await tx.refreshToken.create({
        data: {
          tokenHash: newTokenHash,
          userId: user.id,
          expiresAt: new Date(
            Date.now() +
            REFRESH_TOKEN_EXPIRES_IN,
          ),
        }
      })
    })

    const accessToken = JWTGenerate.accessToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return {
      accessToken,
      refreshToken: newRefreshToken
    }
  },
  logout: async (refreshToken: string) => {
    const tokenHash = hashToken(refreshToken)

    await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null
      },

      data: {
        revokedAt: new Date()
      }
    })
  },
  cleanupExpiredTokens: async () => {
    const now = Date.now()

    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date(now) } },
        ]
      }
    })

    return result.count
  }
}

export default authService