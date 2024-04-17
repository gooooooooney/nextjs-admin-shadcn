import { type UserSchema, type UserCreateSchema } from "@/schema/zod/models";
import { type z } from "zod";

export type UserCreate = z.infer<typeof UserCreateSchema>

export type User = z.infer<typeof UserSchema>