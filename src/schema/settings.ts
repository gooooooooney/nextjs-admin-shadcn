import { Theme } from "@/drizzle/schema/enum";
import { z } from "zod";


/**Profile */
export const ProfileSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }).optional(),
  image: z.string().optional(),
  theme: z.enum([Theme.Enum.dark, Theme.Enum.light, Theme.Enum.system]).optional(),
})

export type ProfileSchema = z.infer<typeof ProfileSchema>

/**Appearance */
export const AppearanceSchema = ProfileSchema.pick({ theme: true }).required()

export type AppearanceSchema = z.infer<typeof AppearanceSchema>

/**Email */
export const EmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type EmailSchema = z.infer<typeof EmailSchema>