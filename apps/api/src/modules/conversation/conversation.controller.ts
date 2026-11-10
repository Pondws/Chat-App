import { Request, Response } from "express"
import conversationService from "./conversation.service"

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
  }
}

export default conversationController