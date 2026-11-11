import { Prisma } from "../../../generated/prisma/client"
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
    include: {
      user: {
        select: userSelect
      }
    }
  }
}

const toDirectKey = (a: string, b: string) => [a, b].sort().join(":")
export const assertMember = async (conversationId: string, userId: string) => {
  const member = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: { conversationId, userId }
    }
  })

  if (!member) throw new Error("ไม่พบแชท")
  return member
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
  },
  getDirect: async (userId: string, otherId: string) => {
    const result = await prisma.conversation.findUnique({
      where: {
        directKey: [userId, otherId].sort().join(":"),
      },
      include: withMembers
    })
    return result
  },
  sendDirect: async (userId: string, otherId: string, content: string) => {
    const isSelf = userId === otherId

    if (!isSelf) {
      const other = await prisma.user.findUnique({
        where: { id: otherId },
        select: { id: true }
      })

      if (!other) throw new Error("ไม่พบผู้ใช้")
    }

    const directKey = toDirectKey(userId, otherId)
    return prisma.$transaction(async (tx) => {
      const now = new Date()
      let conversation = await tx.conversation.findUnique({
        where: {
          directKey
        }
      })

      const created = !conversation

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            isGroup: false,
            directKey,
            members: {
              create: isSelf
                ? [{ userId, lastReadAt: now }]
                : [{ userId, lastReadAt: now }, { userId: otherId }]
            }
          }
        })
      } else {
        await tx.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: now }
        })
        await tx.conversationMember.update({
          where: {
            conversationId_userId: {
              conversationId: conversation.id,
              userId
            }
          },
          data: { lastReadAt: now }
        })
      }

      const message = await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: userId,
          content,
          createdAt: now
        },
        include: {
          sender: {
            select: userSelect
          }
        }
      })

      return { conversationId: conversation.id, created, message }
    })
  }
}

export default conversationService