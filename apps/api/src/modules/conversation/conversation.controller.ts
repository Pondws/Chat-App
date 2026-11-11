import { Request, Response } from "express"
import conversationService from "./conversation.service"
import { ConversationSchema } from "./conversation.schema"

const conversationController = {
  create: async (req: Request, res: Response) => {
    const { conversation, created } = await conversationService.create(req.user!.id, req.body)
    res.status(created ? 200 : 201).json({ conversation })
  },
  getList: async (req: Request, res: Response) => {
    const result = await conversationService.getList(req.user!.id, {
      limit: Math.min(Number(req.query.limit) || 20, 50),
      cursor: req.query.cursor as string | undefined
    })
    res.json(result)
  },
  getDirect: async (req: Request, res: Response) => {
    const { userId } = ConversationSchema.userParams.parse(req.params)
    const result = await conversationService.getDirect(req.user!.id, userId)
    res.status(200).json(result)
  },
  sendDirect: async (req: Request, res: Response) => {
    const { userId } = ConversationSchema.userParams.parse(req.params)
    const { content } = ConversationSchema.content.parse(req.body)
    const result = await conversationService.sendDirect(req.user!.id, userId, content)
    res.status(result.created ? 201 : 200).json(result)
  },
}

export default conversationController