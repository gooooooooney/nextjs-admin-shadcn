import { UserStatus } from "@/drizzle/schema";
import { UserSchema } from "@/drizzle/schema/user";
import { z } from "zod";

export const UpdateUsersSchema = z.object({
  name: z.string().optional(),
  status: UserStatus.optional(),
})


export const createUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
})

export type CreateUser = z.infer<typeof createUserSchema>

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  emailVerified: z.string().optional(),
  from: z.string().optional(),
  role: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getUsersSchema = searchParamsSchema

export type UpdateUsers = z.infer<typeof UpdateUsersSchema>

export const DeleteManyScheme = z.array(z.string())