import {
  CookieOptions,
  Request,
  Response,
} from 'express'
import authService from './auth.service'
import { REFRESH_TOKEN_TTL_MS } from '../../jwt/jwt'

const REFRESH_COOKIE = 'refreshToken'

// เก็บ refresh token ใน httpOnly cookie: JavaScript ฝั่ง browser อ่านไม่ได้ จึงปลอดภัยจาก XSS
// ส่วน access token (อายุสั้น 15 นาที) ส่งใน body ให้ frontend เก็บไว้ใน memory
const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // production ต้องเป็น https
  sameSite: 'lax',
  path: '/auth', // browser จะส่ง cookie นี้ไปเฉพาะ /auth/* เท่านั้น
  maxAge: REFRESH_TOKEN_TTL_MS,
}

// ไม่ต้องมี try/catch: Express 5 ส่ง error จาก async function ไปที่ errorHandler ให้เอง
const AuthController = {
  register: async (req: Request, res: Response) => {
    const user = await authService.register(req.body)
    res.status(201).json({ message: "สมัครสมาชิกเรียบร้อย", user })
  },

  login: async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await authService.login(req.body)

    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions)
    res.json({ accessToken, user })
  },

  refreshToken: async (req: Request, res: Response) => {
    const tokens = await authService.refresh(req.cookies?.[REFRESH_COOKIE])

    res.cookie(REFRESH_COOKIE, tokens.refreshToken, refreshCookieOptions)
    res.json({ accessToken: tokens.accessToken })
  },

  logout: async (req: Request, res: Response) => {
    await authService.logout(req.cookies?.[REFRESH_COOKIE])

    // ตอนลบ cookie ต้องใช้ path เดียวกับตอนตั้ง
    const { maxAge, ...clearOptions } = refreshCookieOptions
    res.clearCookie(REFRESH_COOKIE, clearOptions)
    res.json({ message: "ออกจากระบบเรียบร้อย" })
  },
}

export default AuthController
