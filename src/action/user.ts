"use server"

import { currentUser, getLatestUser } from "@/lib/auth"
import { comparePassword } from "@/lib/compare"
import { getErrorMessage } from "@/lib/handle-error"
import { action } from "@/lib/safe-action"
import { generateNewEmailVerificationToken, generateVerificationToken } from "@/lib/tokens"
import { getUsersSchema } from "@/schema/data/users"
import { AppearanceSchema, EmailSchema, ProfileSchema } from "@/schema/settings"
import { getUserByEmail, updateUser } from "@/server/data/user"
import { db } from "@/server/db"
import { sendVerificationEmail } from "@/server/mail/send-email"
import { ActionReturnValue, AuthResponse } from "@/types/actions"
import { User } from "@/types/model/user"
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

export const getUsers = action<typeof getUsersSchema, ActionReturnValue<{
  data: User[],
  total: number,
}>>(getUsersSchema, async (params) => {
  const {
    page,
    per_page,
    sort,
    name,
    email,
    operator,
    from,
    to,
  } = params

  // Offset to paginate the results
  const offset = (page - 1) * per_page
  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  const [column, order] = (sort?.split(".").filter(Boolean) ?? [
    "createdAt",
    "desc",
  ]) as [keyof User | undefined, "asc" | "desc" | undefined]

  // Filter tasks by date range
  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined
  try {
    const { data, total } = await db.$transaction(async db => {
      type Where = NonNullable<NonNullable<Parameters<typeof db.user.findMany>[0]>["where"]>
      const where: Where = {}
      if (!operator || operator === "and") {
        where.AND = [
          { email: { contains: email } },
          
          { createdAt: { gte: fromDay, lte: toDay } },
        ]
      } else {
        where.OR = [
          { email: { contains: email } },
          { createdAt: { gte: fromDay, lte: toDay } },
        ]
      }


      const data = await db.user.findMany({
        where,
        skip: offset,
        take: per_page,
        orderBy: column ?
          {
            [column]: order,
          } : {
            id: "desc",
          },

      })
      const total = await db.user.count({ where })

      const pageCount = Math.ceil(total / per_page)
      return { data, total: pageCount }
    })
    revalidatePath('/products')
    return { data: { data, total }, error: null }
  } catch (error) {
    return { error: getErrorMessage(error), data: null }
  }
})

