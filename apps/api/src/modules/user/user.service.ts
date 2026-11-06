import { prisma } from "../../../lib/prisma"
import { HttpError } from "../../lib/http-error"

const userService = {
  getMe: async (id: number) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!user) {
      throw new HttpError(404, "ไม่พบผู้ใช้งาน")
    }

    return user
  }
}

export default userService