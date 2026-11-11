import { z } from 'zod'

export const ConversationSchema = {
  userParams: z.object({
    userId: z.uuid()
  }),
  content: z.object({
    content: z.string().trim().min(1).max(4000)
  }),
  params: z.object({
    id: z.uuid() 
  })
}