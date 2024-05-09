"use server"
import { unstable_noStore as noStore } from "next/cache"
import { currentUser, getLatestUser } from "@/lib/auth"
import { comparePassword } from "@/lib/compare"
import { getErrorMessage } from "@/lib/handle-error"
import { action } from "@/lib/safe-action"
import { generateNewEmailVerificationToken } from "@/lib/tokens"
import { DeleteManyScheme, getUsersSchema } from "@/schema/data/users"
import { AppearanceSchema, EmailSchema, ProfileSchema } from "@/schema/settings"
import { UserSchema, user, role, UserRole, userRelation } from "@/drizzle/schema"
import { deleteUserById, deleteUsersByIds, getUserByEmail, updateUser } from "@/server/data/user"
import { sendVerificationEmail } from "@/server/mail/send-email"
import { ActionReturnValue, AuthResponse } from "@/types/actions"
import { type User } from "@/drizzle/schema"
import { User as UserDataType } from '@/types/model/user'
import { revalidatePath } from "next/cache"
import { db } from "@/drizzle/db"
import { and, asc, count, desc, eq, getTableColumns, gte, isNotNull, isNull, lte, or } from "drizzle-orm"
import { filterColumn } from "@/lib/filter-column"


export { updateUser }

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
  noStore()
  try {
    const {
      page,
      per_page,
      sort,
      name,
      email,
      emailVerified,
      role: userRole,
      operator,
      from,
      to,
    } = params

    const userinfo = await currentUser()
    // 普通用户没有权限查看用户列表
    if (userinfo?.role === UserRole.enum.user) {
      return { data: [], pageCount: 0 }
    }

    const offset = (page - 1) * per_page

    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof User | undefined, "asc" | "desc" | undefined]

    // Filter user by date range
    const fromDay = from ? new Date(from) : undefined
    const toDay = to ? new Date(to) : undefined


    const whereParams = () => [
      isNull(user.deletedAt),
      name
        ? filterColumn({
          column: user.name,
          value: name,
        })
        : undefined,
      email
        ? filterColumn({
          column: user.email,
          value: email,
        })
        : undefined,
      // admin 只能查看自己创建的用户 superAdmin 可以查看所有用户
      userinfo?.role === UserRole.enum.admin ? and(
        eq(user.createdById, userinfo!.id),
        isNull(user.deletedAt),
        isNull(user.deletedById)
      ) : undefined,
      !!userRole
        ? filterColumn({
          column: role.userRole,
          value: userRole,
          isSelectable: true,
        })
        : undefined,
      emailVerified === '1' ? isNotNull(user.emailVerified) : emailVerified === '0' ? isNull(user.emailVerified) : undefined,
      // Filter by createdAt
      fromDay && toDay
        ? and(
          gte(user.createdAt, fromDay),
          lte(user.createdAt, toDay)
        )
        : undefined]
    const { password, ...rest } = getTableColumns(user);

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({ ...rest, role })
        .from(user)
        .limit(per_page)
        .offset(offset)
        .leftJoin(role, eq(user.id, role.userId))
        .where(
          !operator || operator === "and" ? and(...whereParams()) : or(...whereParams()),
        )
        .orderBy(
          column && column in user
            ? order === "asc"
              ? asc(user[column])
              : desc(user[column])
            : desc(user.id)
        ) as unknown as UserDataType[]

      const total = await tx
        .select({
          count: count(),
        })
        .from(user)
        .leftJoin(role, eq(user.id, role.userId))
        .where(
          !operator || operator === "and" ? and(...whereParams()) : or(...whereParams())
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    console.log(err)
    return { data: [], pageCount: 0 }
  }
})

const DeleteScheme = UserSchema.pick({ id: true }).required()

export const deleteUser = action<typeof DeleteScheme, ActionReturnValue<{ id: string }[]>>(DeleteScheme, async ({ id }) => {
  const [err, data] = await deleteUserById(id)
  if (err) {
    return { error: getErrorMessage(err), data: null }
  }
  revalidatePath("/system/users")
  return { data, error: null }
})


export const deleteUsersAction = action<typeof DeleteManyScheme, ActionReturnValue<{ id: string }[]>>(DeleteManyScheme, async (ids) => {
  const [err, data] = await deleteUsersByIds(ids)
  if (err) {
    return { error: getErrorMessage(err), data: null }
  }
  revalidatePath("/system/users")
  return { data, error: null }
})
