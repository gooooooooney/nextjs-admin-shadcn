import { z } from "zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  label: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getMenusSchema = searchParamsSchema

export type GetMenusSchema = z.infer<typeof getMenusSchema>

export const assignMenusToUserSchema = z.object({
  userId: z.string(),
  menuIds: z.array(z.string()),
})

export type AssignMenusToUserSchema = z.infer<typeof assignMenusToUserSchema>