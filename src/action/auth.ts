"use server"

import { DEFAULT_LOGIN_REDIRECT } from "@/config/routes";
import { action } from "@/lib/safe-action"
import { loginSchema } from "@/schema/auth"
import { signIn } from "@/server/auth";
import { getUserByEmail } from "@/server/data/user";
import { AuthError } from "next-auth";

export const login = action(loginSchema, async (params) => {
  const { email } = params;

  const existingUser = await getUserByEmail(email);

  if (!existingUser?.password || !existingUser.email) {
    return {
      error: "Email does not exist"
    }
  }

  try {
    await signIn("credentials", { ...params, redirectTo: DEFAULT_LOGIN_REDIRECT });
  } catch (error) {
    if (!(error instanceof AuthError)) throw error;

    switch (error.type) {
      case "CredentialsSignin":
        return {
          error: "Invalid credentials"
        }
      default:
        return {
          error: "An error occurred"
        }
    }
  }
})