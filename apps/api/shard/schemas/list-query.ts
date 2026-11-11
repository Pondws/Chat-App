import { z } from "zod"

export const listQuerySchema = z.object({
  // page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string()
  // dateType: z
  //   .enum(["createdAt", "updatedAt"])
  //   .default("createdAt"),

  // startDate: z.coerce.date().optional(),
  // endDate: z.coerce.date().optional(),
})

export type ListQuery = z.infer<typeof listQuerySchema>