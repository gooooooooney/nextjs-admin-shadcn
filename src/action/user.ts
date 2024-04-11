"use server"

import { currentUser, getLatestUser } from "@/lib/auth"
import { comparePassword } from "@/lib/compare"
import { action } from "@/lib/safe-action"
import { generateNewEmailVerificationToken, generateVerificationToken } from "@/lib/tokens"
import { AppearanceSchema, EmailSchema, ProfileSchema } from "@/schema/settings"
import { getUserByEmail, updateUser } from "@/server/data/user"
import { sendVerificationEmail } from "@/server/mail/send-email"
import { AuthResponse } from "@/types/actions"
import { revalidatePath } from "next/cache"

export const updateProfile = action(ProfileSchema, async (params) => {
  const { username, image } = params

  const user = await currentUser()

  if (!user) {

    return {
      error: "The login has expired."
    }
  }

  try {
    const result = await updateUser(user.id, { name: username, image })

    if (!result) return { error: "An error occurred2" }
    revalidatePath("/", "layout")
    return { success: "Profile updated" }
  } catch (error) {
    return { error: "An error occurred1" }
  }
})

export const updateEmail = action<typeof EmailSchema, AuthResponse>(EmailSchema, async (params) => {
  const { email, password } = params
  const user = await getLatestUser()

  if (!user) {

    return {
      error: "The login has expired."
    }
  }
  if (user.email === email) {

    return {
      error: "The email is the same."
    }
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }
  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return { error: "Invalid password" };
  }

  const verificationToken = await generateNewEmailVerificationToken(email, user.id);

  return await sendVerificationEmail({
    email: verificationToken.email,
    token: verificationToken.token,
    verificationPath: "new-email-verification"
  });

})

export const updatePreferences = action(AppearanceSchema, async (params) => {
  const { theme } = params

  const user = await currentUser()

  if (!user) {

    return {
      error: "The login has expired."
    }
  }

  try {
    const result = await updateUser(user.id, { theme })

    if (!result) return { error: "An error occurred2" }
    revalidatePath("/settings/appearance")
    return { success: "Profile updated" }
  } catch (error) {
    return { error: "An error occurred1" }
  }
})

