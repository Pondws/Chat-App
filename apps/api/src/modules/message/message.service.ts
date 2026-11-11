import { prisma } from "../../lib/prisma"
import { assertMember } from "../conversation/conversation.service"

const messageService = {
  get: async (
    conversationId: string,
    userId: string,
    { limit, cursor }: { limit: number; cursor: string }
  ) => {
    await assertMember(conversationId, userId)

    const rows = await prisma.message.findMany({
      where: { conversationId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor && {
        cursor: {
          id: cursor
        },
        skip: 1
      }),
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    const hasMore = rows.length > limit
    const data = hasMore ? rows.slice(0, limit) : rows

    return { data, nextCursor: hasMore ? data[data.length - 1].id : null }
  },
  send: async (conversationId: string, userId: string, content: string) => {
    await assertMember(conversationId, userId)

    const now = new Date()
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          senderId: userId,
          content
        }
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: now }
      }),
      prisma.conversationMember.update({
        where: {
          conversationId_userId: {
            conversationId,
            userId
          }
        },
        data: { lastReadAt: now }
      })
    ])

    return message
  },
  markRead: () => { }
}

export default messageService