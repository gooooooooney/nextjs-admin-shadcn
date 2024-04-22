import { Theme, UserRole } from "@prisma/client";
import { getEnhancedPrisma } from "../db/enhance";
import { db } from "@/drizzle/db";
import { eq, inArray } from "drizzle-orm";
import { user, role, UserSchema } from "@/drizzle/schema";
import { currentUser } from "@/lib/auth";
import to from "@/lib/utils";
import { SignupByTokenSchema, SignupSchema } from "@/schema/auth";
import { TypeOf, z } from "zod";

export const getUserByEmail = async (email: string) => {

  return await db.query.user.findFirst({
    where: eq(user.email, email)
  })

}

export const getUserById = async (id: string) => {
  try {
    const users = await db.query.user.findFirst({
      with: {
        role: {
          columns: {
            userRole: true
          }
        }
      },
      where: eq(user.id, id)
    })
    // ({ where: { id }, include: { role: { select: { userRole: true } } } });

    return users;
  } catch {
    return null;
  }
};

export const updateUser = async (id: string, data: { name?: string; email?: string; image?: string, theme?: Theme }) => {
  try {
    return await db.update(user).set(data).where(eq(user.id, id)).returning({ id: user.id })
  } catch (error) {
    return null
  }
}

export const updateUserPassword = async (email: string, data: { password?: string }) => {
  try {
    return await db.update(user).set(data).where(eq(user.email, email)).returning({ id: user.id })
  } catch (error) {
    return null
  }
}

export const updateUserEmail = async (id: string, email: string) => {
  try {
    return await db.update(user).set({ email, emailVerified: new Date() }).where(eq(user.id, id)).returning({ id: user.id })
  } catch (error) {
    return null
  }

}

export const deleteUserById = async (id: string) => {
  const userinfo = await currentUser()
  return to(db.update(user).set({
    deletedAt: new Date(),
    deletedById: userinfo?.id
  }).where(eq(user!.id, id)).returning({ id: user.id }))
}

export const deleteUsersByIds = async (ids: string[]) => {
  const userinfo = await currentUser()
  return to(db.update(user).set({
    deletedAt: new Date(),
    deletedById: userinfo?.id
  }).where(inArray(user.id, ids)).returning({ id: user.id }))
}

export const createUser = async (data: Omit<z.infer<typeof SignupSchema>, 'confirmPassword'>) => {
  const { adminId, ...rest } = data
  return to(db.transaction(async tx => {
    const result = await tx.insert(user).values({
      ...rest,
      createdById: adminId
    }).returning({ userId: user.id })
    if (!result[0]) return new Error('Failed to create user')

    await tx.insert(role).values({
      // For now, by default, registration grants admin permissions, used for demonstrating the backend management system.
      userRole: UserRole.admin,
      userId: result[0].userId
    }).returning({ id: role.id })
    return result
  }))
}

export const createUserByAdmin = async (data: Omit<z.infer<typeof SignupSchema>, "confirmPassword"> & { adminId: string }) => {
  const { adminId, ...rest } = data
  return to(db.transaction(async tx => {
    const result = await tx.insert(user).values({
      ...rest,
      createdById: adminId,
      // It is verified by the token
      emailVerified: new Date(),
    }).returning({ userId: user.id })
    if (!result[0]) return new Error('Failed to create user')

    await tx.insert(role).values({
      userId: result[0].userId
    }).returning({ id: role.id })
    return result
  }))
}