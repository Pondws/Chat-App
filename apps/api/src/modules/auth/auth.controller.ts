import {
  Request,
  Response,
} from 'express'
import authService from './auth.service'
import authSchema from './auth.schema'

const AuthController = {
  register: async (req: Request, res: Response) => {
    const body = authSchema.register.parse(req.body)
    await authService.register(body)
    res.status(201).json({ message: "สมัครสมาชิกเรียบร้อย" })
  },
  login: async (req: Request, res: Response) => {
    const body = authSchema.login.parse(req.body)
    const data = await authService.login(body)
    res.status(200).json(data)
  },
  refreshToken: async (req: Request, res: Response) => {
    res.status(200)
  },
  logout: async (req: Request, res: Response) => {
    console.log(req)
  },
}

export default AuthController

