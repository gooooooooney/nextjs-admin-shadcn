"use server"

import { DEFAULT_LOGIN_REDIRECT } from "@/config/routes";
import { action } from "@/lib/safe-action"
import { LoginSchema, NewPasswordSchema, ResetSchema, SignupSchema } from "@/schema/auth"
import { signIn, signOut } from "@/server/auth";
import { getUserByEmail } from "@/server/data/user";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { generatePasswordResetToken } from "@/lib/tokens";
import { env } from "@/env";
import { getPasswordResetTokenByToken } from "@/server/data/password-reset-token";


export const login = action(LoginSchema, async (params: LoginSchema) => {
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


export const signup = action(SignupSchema, async (params) => {
  const { email, password, username } = params;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
    },
  });

  return {
    success: "User created"
  }
})


export const reset = action(ResetSchema, async (params) => {
  const { email } = params;

  const existingUser = await getUserByEmail(email);

  if (!existingUser?.email) {
    return {
      error: "Email does not exist"
    }
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  return {
    success: "Email sent",
    // For now we just send the link in the response
    link: `${env.NEXT_PUBLIC_APP_URL}/new-password?token=${passwordResetToken.token}`
  }
})


export const newPassword = async (params: NewPasswordSchema, token?: string) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(params);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;


  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      error: "Invalid token"
    }
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      email: existingToken.email
    },
    data: {
      password: hashedPassword
    }
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id
    }
  });

  return {
    success: "Password updated!"
  }
}



export const logout = async () => {
  await signOut();
  revalidatePath("/", "layout");
};
