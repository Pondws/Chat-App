import { Request, Response } from "express"
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
  },
  searh: async (req: Request, res: Response) => {
    const raw = req.query.q as string

    const query = raw.trim()
    if (query.length < 3) {
      return res.status(400).json({ message: "คำค้นหาต้องมีอย่างน้อย 2 ตัวอักษร" })
    }

    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20))

    const result = await userService.search(query, page, limit)
    return res.status(200).json(result)
  }
}

export default UserController