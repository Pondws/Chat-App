import { Request, Response } from "express"
import messageService from "./message.service"
import { ConversationSchema } from "../conversation/conversation.schema"
import { listQuerySchema } from "../../../shard/schemas/list-query"

const messageController = {
  get: async (req: Request, res: Response) => {
    const { id } = ConversationSchema.params.parse(req.params)
    const query = listQuerySchema.parse(req.query)
    const result = await messageService.get(id, req.user!.id, query)
    res.status(200).json(result)
  },
  send: async (req: Request, res: Response) => {
    const { id } = ConversationSchema.params.parse(req.params)
    const { content } = ConversationSchema.content.parse(req.body)
    const result = await messageService.send(id, req.user!.id, content)
    res.status(201).json(result)
  },
  markRead: async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await messageService.markRead()
  },
}

export default messageController