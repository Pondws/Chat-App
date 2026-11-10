import { Request, Response, CookieOptions, NextFunction } from "express"
import authService from "./auth.service"
import authSchema from "./auth.schema"

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
}

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE })
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE })
}

const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", cookieOptions)
  res.clearCookie("refreshToken", cookieOptions)
}

const AuthController = {
  register: async (req: Request, res: Response) => {
    const body = authSchema.register.parse(req.body)
    await authService.register(body)
    const { user, accessToken, refreshToken } = await authService.login({
      email: body.email,
      password: body.password,
    })
    setAuthCookies(res, accessToken, refreshToken)
    res.status(201).json({ user })
  },

  login: async (req: Request, res: Response) => {
    const body = authSchema.login.parse(req.body)
    const { user, accessToken, refreshToken } = await authService.login(body)
    setAuthCookies(res, accessToken, refreshToken)
    res.status(200).json({ user })
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken
      if (!refreshToken) {
        return res.status(401).json({ message: "ไม่พบ Refresh token" })
      }

      const result = await authService.refresh({ refreshToken })
      setAuthCookies(res, result.accessToken, result.refreshToken)
      return res.status(200).json({ message: "Token refreshed" })
    } catch (error) {
      clearAuthCookies(res)
      next(error)
    }
  },
  logout: async (req: Request, res: Response, _: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error(error)
    } finally {
      clearAuthCookies(res)
    }
    return res.status(200).json({ message: "ออกจากระบบเรียบร้อย" })
  }
}

export default AuthController