import { z } from 'zod'

const authSchema = {
  register: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(6).max(72), // bcrypt ignores bytes past 72
    name: z.string().trim().min(1).max(100),
  }),
  login: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1),
  }),
  refreshToken: z.object({
    refreshToken: z.string().min(1),
  }),
}

export type RegisterInput = z.input<typeof authSchema.register>
export type LoginInput = z.input<typeof authSchema.login>

export default authSchema
