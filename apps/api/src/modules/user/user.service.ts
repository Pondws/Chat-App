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
  },
  search: (query: string, page = 1, limit = 20) => {
    return prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive"
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
      skip: (page - 1) * limit,
      take: limit
    })
  }
}

export default userService