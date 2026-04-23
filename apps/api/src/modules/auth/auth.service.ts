import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'
// import {
//   omit
// } from 'lodash'
import authSchema from './auth.validation'
import JWTGenerate from '../../jwt/jwt'

type User = {
  email: string
  password: string
  name: string
}

const authService = {
  register: async (user: User) => {
    const validated = authSchema.register.parse(user)

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (existingUser) {
      throw new Error("มีผู้ใช้ในระบบแล้ว")
    }

    const hashed = await bcrypt.hash(validated.password, 10)

    const {
      password,
      ...rest
    } = validated

    const newUser = await prisma.user.create({
      data: {
        ...rest,
        password: hashed
      }
    })

    return newUser
  },
  login: async (email: string, password: string) => {
    const validated = authSchema.login.parse({
      email,
      password
    })

    const user = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (!user) {
      throw new Error("อีเมล์หรือรหัสผ่านไม่ถูกต้อง")
    }

    const match = await bcrypt.compare(validated.password, user.password)

    if (!match) {
      throw new Error("อีเมล์หรือรหัสผ่านไม่ถูกต้อง")
    }

    const payload = {
      id: user.id,
      email: user.email,
    }

    const token = {
      accessToken: JWTGenerate.accessToken(payload),
      refreshToken: JWTGenerate.refreshToken(payload)
    }

    return token
  },
}

export default authService