import {
  Request,
  Response
} from 'express'
import userService from './user.service'

const userController = {
  getMe: async (req: Request, res: Response) => {
    // req.id ถูกใส่โดย authorization middleware
    const user = await userService.getMe(req.id!)
    res.json(user)
  }
}

export default userController
