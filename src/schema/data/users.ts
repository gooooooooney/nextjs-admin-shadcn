import { z } from "zod";
import { UserSchema } from "../zod/models";

export const UpdateUsersSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
}).partial({
  name: true,
  email: true,
})


export const createUsersSchema = UserSchema.pick({
  name: true,
  email: true,
})

export type CreateTask = z.infer<typeof createUsersSchema>

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  email:z.string().email().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getUsersSchema = searchParamsSchema

export type UpdateUsers = z.infer<typeof UpdateUsersSchema>