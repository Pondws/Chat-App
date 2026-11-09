import { prisma } from "../../lib/prisma"

const userService = {
  getMe: (userId: string) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}

export default userService