import { z } from "zod"
import authSchema from "./auth.schema"

export type Role =
  | "ADMIN"
  | "USER"

export type AuthUser = {
  id: string
  email: string
  role: Role
}

export type RegisterInput =
  z.infer<typeof authSchema.register>

export type LoginInput =
  z.infer<typeof authSchema.login>

// export type RefreshInput =
//   z.infer<typeof authSchema.refresh>