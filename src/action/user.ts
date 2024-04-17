"use server"

import { currentUser, getLatestUser } from "@/lib/auth"
import { comparePassword } from "@/lib/compare"
import { getErrorMessage } from "@/lib/handle-error"
import { action } from "@/lib/safe-action"
import { generateNewEmailVerificationToken, generateVerificationToken } from "@/lib/tokens"
import { DeleteManyScheme, getUsersSchema } from "@/schema/data/users"
import { AppearanceSchema, EmailSchema, ProfileSchema } from "@/schema/settings"
import { UserSchema } from "@/schema/zod/models"
import { deleteUserById, deleteUsersByIds, getUserByEmail, updateUser } from "@/server/data/user"
import { db } from "@/server/db"
import { getEnhancedPrisma } from "@/server/db/enhance"
import { sendVerificationEmail } from "@/server/mail/send-email"
import { ActionReturnValue, AuthResponse } from "@/types/actions"
import { User } from "@/types/model/user"
import { UserRole } from "@prisma/client"
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

export const getUsers = action(getUsersSchema, async (params) => {
  const {
    page,
    per_page,
    sort,
    name,
    emailVerified,
    role,
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
  const { db, user } = await getEnhancedPrisma()
  try {
    const { data, total } = await db.$transaction(async db => {
      type Where = NonNullable<NonNullable<Parameters<typeof db.user.findMany>[0]>["where"]>

      const userRole = role ? ({
        in: role!.split(".") as UserRole[]
      }) : undefined

      const emailVerifiedParam = emailVerified === '1' ? {
        not: null
      } : emailVerified === '0' ? {
        equals: null
      } : undefined

      const where: Where = {
        role: {
          userRole,
        },
        emailVerified: emailVerifiedParam
      }

      switch (user?.role) {
        case UserRole.user:
          // If the user is not an admin, return an empty array
          return { data: [], total: 0 }
        case UserRole.admin:
          // If the user is an admin, only return the tasks created by the user
          where.createdById = user.id
          // Only return users that have not been deleted
          where.deletedAt = null;
          where.deletedById = null;
          break
        case UserRole.superAdmin:
          // If the user is a super admin, return all user
          break
      }
      const params = [
        { name: { contains: name } },
        { createdAt: { gte: fromDay, lte: toDay } },
      ]
      if (!operator || operator === "and") {
        where.AND = [...params]
      } else {
        where.OR = [...params]
      }
      const data = await db.user.findMany({
        where,
        include: {
          role: {
            include: {
              menus: true,
            }
          },
          deletedBy: true,
          createdBy: true,
        },
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
    revalidatePath('/users')
    return { data: { data, total }, error: null }
  } catch (error) {
    return { error: getErrorMessage(error), data: null }
  }
})

const DeleteScheme = UserSchema.pick({ id: true })

export const deleteUser = action<typeof DeleteScheme, ActionReturnValue<User>>(DeleteScheme, async ({ id }) => {
  const [err, data] = await deleteUserById(id)
  if (err) {
    return { error: getErrorMessage(err), data: null }
  }
  revalidatePath("/users")
  return { data, error: null }
})


export const deleteUsersAction = action(DeleteManyScheme, async (ids) => {
  const [err, data] = await deleteUsersByIds(ids)
  if (err) {
    return { error: getErrorMessage(err), data: null }
  }
  revalidatePath("/users")
  return { data, error: null }
})
