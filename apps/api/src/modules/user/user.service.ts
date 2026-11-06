import { prisma } from "../../../lib/prisma"
import { AppError } from "../../utils/app-error"

const userService = {
  getMe: async (id: number) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        avatarUrl: true,
        name: true
      }
    })

    if (!user) {
      throw new AppError("ไม่พบผู้ใช้งาน", 404)
    }

    return user
  }
}

export default userService