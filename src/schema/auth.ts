import { z } from "zod";

/** Login */
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginSchema = z.infer<typeof LoginSchema>

/** Signup */
export const SignupSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
})
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignupSchema = z.infer<typeof SignupSchema>

/** Signup by token */
export const SignupByTokenSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  token: z.string(),
})
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignupByTokenSchema = z.infer<typeof SignupByTokenSchema>

/** ResetPassword */
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export type ResetSchema = z.infer<typeof ResetSchema>


/** NewPassword */
export const NewPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
})
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type NewPasswordSchema = z.infer<typeof NewPasswordSchema>

/** RegisterByAdmin */
export const RegisterByAdminSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  adminId: z.string(),
})
export type RegisterByAdminSchema = z.infer<typeof RegisterByAdminSchema>