import { z } from 'zod'

const authSchema = {
  register: z.object({
    email: z.email(),
    password: z.string().min(6),
    name: z.string()
  }),
  login: z.object({
    email: z.email(),
    password: z.string().min(6)
  })
}

export default authSchema