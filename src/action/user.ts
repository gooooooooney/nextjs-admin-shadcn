"use server"

import { currentUser } from "@/lib/auth"
import { action } from "@/lib/safe-action"
import { AppearanceSchema, ProfileSchema } from "@/schema/settings"
import { getUserByEmail, updateUser } from "@/server/data/user"
import { revalidatePath } from "next/cache"

export const updateProfile = action(ProfileSchema, async (params) => {
  const { username, email, image } = params

  const user = await currentUser()

  if (!user) {

    return {
      error: "The login has expired."
    }
  }
  if (email && user.email !== email) {

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use!" };
    }
  }

  try {
    const result = await updateUser(user.id, { name: username, email, image })

    if (!result) return { error: "An error occurred2" }
    revalidatePath("/", "layout")
    return { success: "Profile updated" }
  } catch (error) {
    return { error: "An error occurred1" }
  }
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

