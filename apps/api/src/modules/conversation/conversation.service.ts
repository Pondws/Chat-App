import { Request, Response } from "express"
import { errorHandler } from "../../middlewares/error-handler"
import { prisma } from "../../lib/prisma"

type CreateConversation = {
  participantIds?: string[]
  name?: string
}

const userSelect = {
  id: true,
  name: true
}
const withMembers = {
  members: {
    include:
    {
      user:
      {
        select:
          userSelect
      }
    }
  }
}

const conversationService = {
  create: async (userId: string, body: CreateConversation) => {

    console.log("test", userId, body)
    if (!Array.isArray(body.participantIds)) throw new Error("เกิดข้อผิดพลาด")

    const unique = [...new Set(body.participantIds)]
    if (unique.length === 0) throw new Error("เกิดข้อผิดพลาด")

    const others = unique.filter(id => id !== userId)

    if (others.length === 0) {
      const existingSelf = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          members: {
            every: { userId },
            some: { userId }
          }
        },
        include: withMembers
      })

      if (existingSelf) return { conversation: existingSelf, created: false }

      const conversation = await prisma.conversation.create({
        data: {
          isGroup: false,
          members: {
            create: [{ userId }]
          }
        },
        include: withMembers
      })

      return { conversation, created: true }
    }

    const found = await prisma.user.count({
      where: {
        id: {
          in: others
        }
      }
    })
    if (found !== others.length) throw new Error("เกิดข้อผิดพลาด")

    const isGroup = others.length > 0

    if (!isGroup) {
      const existing = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [
            { members: { some: { userId } } },
            { members: { some: { userId: others[0] } } }
          ]
        },
        include: withMembers
      })

      if (existing) return { conversation: existing, created: false }
    }

    const conversation = await prisma.conversation.create({
      data: {
        isGroup,
        name: isGroup ? name ?? null : null,
        members: {
          create: [userId, ...others].map(id => ({ userId: id }))
        }
      },
      include: withMembers
    })

    return { conversation, created: true }
  }
}

export default conversationService