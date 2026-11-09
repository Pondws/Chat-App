import type { Request, Response } from "express"
import userService from "./user.service"

const UserController = {
  getMe: async (req: Request, res: Response) => {
    try {
      const user = await userService.getMe(req.user!.id)
      return res.json(user)
    } catch (error) {
      return res.status(404).json({
        message: "User not found",
      })
    }
  }
}

export default UserController