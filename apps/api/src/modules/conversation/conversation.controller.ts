import { Request, Response } from "express"
import conversationService from "./conversation.service"

const conversationController = {
  create: async (req: Request, res: Response) => {
    const { conversation, created } = await conversationService.create(req.user!.id, req.body)
    res.status(created ? 200 : 201).json({ conversation })
  }
}

export default conversationController