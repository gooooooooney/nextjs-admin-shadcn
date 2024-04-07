import { z } from "zod";

export const ProfileSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }).optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
})

export type ProfileSchema = z.infer<typeof ProfileSchema>