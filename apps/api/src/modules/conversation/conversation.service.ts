import { prisma } from "../../lib/prisma"

type CreateConversation = {
  participantIds?: string[]
  name?: string
}

type ListOptions = {
  limit?: number
  cursor?: string
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
    const { participantIds, name } = body
    if (!Array.isArray(participantIds)) throw new Error("เกิดข้อผิดพลาด")

    const unique = [...new Set(participantIds)]
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

    const isGroup = others.length > 1

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
  },
  getList: async (userId: string, { limit = 20, cursor }: ListOptions) => {
    const members = await prisma.conversationMember.findMany({
      where: { userId },
      orderBy: [
        {
          conversation: {
            updatedAt: "desc"
          },
        },
        { conversationId: "desc" }
      ],
      take: limit + 1,
      ...(cursor && {
        cursor: {
          conversationId_userId: {
            conversationId: cursor, userId
          }
        },
        skip: 1
      }),
      include: {
        conversation: {
          include: {
            members: {
              where: {
                userId: {
                  not: userId
                }
              },
              take: 1,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            },
            message: {
              orderBy: {
                createdAt: "desc"
              },
              take: 1
            }
          }
        }
      }
    })

    const hasMore = members.length > limit
    const page = hasMore ? members.slice(0, limit) : members

    const unreadCounts = await Promise.all(
      page.map(m => prisma.message.count({
        where: {
          conversationId: m.conversationId,
          senderId: { not: m.userId },
          createdAt: { gt: m.lastReadAt ?? m.joinedAt }
        }
      }))
    )

    const data = page.map((m, i) => {
      const c = m.conversation
      const other = c.members[0]?.user
      return {
        id: c.id,
        isGroup: c.isGroup,
        name: c.isGroup ? c.name : other?.name ?? 'Unknown',
        // avatarUrl: c.isGroup ? null : other?.avatarUrl ?? null,
        lastMessage: c.message[0] ?? null,
        unreadCount: unreadCounts[i],
        updatedAt: c.updatedAt,
      }
    })

    return {
      data,
      nextCursor: hasMore ? page[page.length - 1].conversationId : null,
    }
  }
}

export default conversationService