import { Request, Response } from 'express'
import authService from './auth.service'

// Express 5 forwards errors thrown in async handlers to the error middleware.
const AuthController = {
  register: async (req: Request, res: Response) => {
    const user = await authService.register(req.body)
    res.status(201).json({ message: 'สมัครสมาชิกเรียบร้อย', user })
  },

  login: async (req: Request, res: Response) => {
    res.status(200).json(await authService.login(req.body))
  },

  refreshToken: async (req: Request, res: Response) => {
    res.status(200).json(await authService.refresh(req.body))
  },

  logout: async (req: Request, res: Response) => {
    await authService.logout(req.body)
    res.status(204).end()
  },

  logoutAll: async (req: Request, res: Response) => {
    await authService.logoutAll(req.id!)
    res.status(204).end()
  },
}

export default AuthController
