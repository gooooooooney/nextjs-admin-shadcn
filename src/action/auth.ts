"use server"

import { DEFAULT_LOGIN_REDIRECT } from "@/config/routes";
import { action } from "@/lib/safe-action"
import { LoginSchema, NewPasswordSchema, ResetSchema, SignupSchema } from "@/schema/auth"
import { signIn, signOut } from "@/server/auth";
import { getUserByEmail, getUserById } from "@/server/data/user";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { revalidatePath } from "next/cache";
import { generatePasswordResetToken, generateVerificationToken } from "@/lib/tokens";
import { getPasswordResetTokenByToken } from "@/server/data/password-reset-token";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/server/mail/send-email";
import { getVerificationTokenByToken } from "@/server/data/verification-token";
import { AuthResponse } from "@/types/actions";
import { getNewEmailVerificationTokenByToken } from "@/server/data/email-verification-token";


export const login = action<typeof LoginSchema, AuthResponse | undefined>(LoginSchema, async (params: LoginSchema) => {
  const { email } = params;

  const existingUser = await getUserByEmail(email);
  
  if (!existingUser?.password || !existingUser.email) {
    return {
      error: "Email does not exist"
    }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    return await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });
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


export const signup = action<typeof SignupSchema, AuthResponse>(SignupSchema, async (params) => {
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
      role: {
        create: {
          
        }
      }
    },
  });

  const verificationToken = await generateVerificationToken(email);

  return await sendVerificationEmail({
    email: verificationToken.email,
    token: verificationToken.token,
  });

})


export const reset = action<typeof ResetSchema, AuthResponse>(ResetSchema, async (params) => {
  const { email } = params;

  const existingUser = await getUserByEmail(email);

  if (!existingUser?.email) {
    return {
      error: "Email does not exist"
    }
  }

  const passwordResetToken = await generatePasswordResetToken(email);


  return await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  )
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
export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    }
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Email verified!" };
};

export const newEmailVerification = async (token: string) => {
  const existingToken = await getNewEmailVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserById(existingToken.userId);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    }
  });

  await db.newEmailVerificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Email verified!" };
};


export const logout = async () => {
  await signOut();
  revalidatePath("/", "layout");
};
