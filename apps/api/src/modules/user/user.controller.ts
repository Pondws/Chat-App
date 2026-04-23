import {
  Request,
  Response
} from 'express'
import userService from './user.service'

const userController = {
  getMe: async (req: Request, res: Response) => {
    try {
      const { id } = req as { id: number }
      const user = await userService.getMe(id)
      res.json(user)
    } catch (error) {
      res.status(500)
    }
  }
}

export default userController