import bcrypt from 'bcrypt'
import { createHash } from 'node:crypto'
import { prisma } from '../../../lib/prisma'
import authSchema from './auth.validation'
import JWTGenerate, { JwtPayload, REFRESH_TOKEN_TTL_MS } from '../../jwt/jwt'
import { AppError } from '../../utils/app-error'

// เก็บแค่ hash ของ refresh token ใน DB
// ถ้า DB หลุด คนร้ายก็เอา hash ไปใช้แทน token จริงไม่ได้
const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex')

// สร้าง access + refresh token ใหม่ และบันทึก refresh token ลง DB
const issueTokens = async (payload: JwtPayload) => {
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
  register: async (body: unknown) => {
    const validated = authSchema.register.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (existingUser) {
      throw new AppError("มีผู้ใช้ในระบบแล้ว", 409)
    }

    const hashed = await bcrypt.hash(validated.password, 10)

    const newUser = await prisma.user.create({
      data: {
        ...validated,
        password: hashed
      },
      // ไม่ส่ง password กลับออกไป
      select: { id: true, email: true, name: true }
    })

    return newUser
  },

  login: async (body: unknown) => {
    const validated = authSchema.login.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    // ใช้ข้อความเดียวกันทั้ง 2 กรณี เพื่อไม่บอกใบ้ว่าอีเมลนี้มีในระบบหรือไม่
    if (!user) {
      throw new AppError("อีเมล์หรือรหัสผ่านไม่ถูกต้อง", 401)
    }

    const match = await bcrypt.compare(validated.password, user.password)

    if (!match) {
      throw new AppError("อีเมล์หรือรหัสผ่านไม่ถูกต้อง", 401)
    }

    const tokens = await issueTokens({ id: user.id, email: user.email })

    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name },
    }
  },

  // Refresh Token Rotation:
  // ทุกครั้งที่ใช้ refresh token จะถูกลบทิ้งแล้วออกใบใหม่ให้
  // ถ้ามีคนขโมย token เก่าไปใช้ซ้ำ จะใช้ไม่ได้เพราะไม่มีใน DB แล้ว
  refresh: async (refreshToken?: string) => {
    if (!refreshToken) {
      throw new AppError("ไม่พบ Refresh Token", 401)
    }

    let payload: JwtPayload
    try {
      payload = JWTGenerate.verifyRefreshToken(refreshToken)
    } catch {
      throw new AppError("Refresh Token ไม่ถูกต้องหรือหมดอายุ", 401)
    }

    // deleteMany คืนจำนวนแถวที่ลบ: ถ้าเป็น 0 แปลว่า token นี้ถูกใช้ไปแล้วหรือ logout แล้ว
    const { count } = await prisma.refreshToken.deleteMany({
      where: { tokenHash: hashToken(refreshToken) },
    })

    if (count === 0) {
      throw new AppError("Refresh Token ถูกยกเลิกแล้ว", 401)
    }

    return issueTokens({ id: payload.id, email: payload.email })
  },

  logout: async (refreshToken?: string) => {
    if (!refreshToken) return

    await prisma.refreshToken.deleteMany({
      where: { tokenHash: hashToken(refreshToken) },
    })
  },
}

export default authService
