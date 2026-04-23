import {
  Request,
  Response,
} from 'express'
import authService from './auth.service'

const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const user = await authService.register(req.body)
      console.log('user', user)
      res.status(200).json({ message: "สมัครสมาชิกเรียบร้อย" })
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Something went wrong'
      })
    }
  },
  login: async (req: Request, res: Response) => {
    const {
      email,
      password
    } = req.body

    try {
      const data = await authService.login(email, password)
      res.status(200).json(data)
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Something went wrong'
      })
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    console.log(req)
  }
}

export default AuthController

