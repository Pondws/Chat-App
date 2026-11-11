import { z } from "zod"

export const getSearchOptionsSchema = z.object({
  search: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10)
})

export type GetSearchOptions = z.infer<typeof getSearchOptionsSchema>