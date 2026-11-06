import { Request, Response } from 'express'
import userService from './user.service'

const userController = {
  getMe: async (req: Request, res: Response) => {
    res.json(await userService.getMe(req.id!))
  },
}

export default userController
