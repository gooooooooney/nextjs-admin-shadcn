import { db } from "@/drizzle/db";
import { format, toDate } from "date-fns"
import { eq, inArray, isNotNull } from "drizzle-orm";
import { user, role, Theme, UserRole, UserStatus, userMenuTable } from "@/drizzle/schema";
import { currentUser } from "@/lib/auth";
import to from "@/lib/utils";
import { SignupSchema } from "@/schema/auth";
import { z } from "zod";
import { env } from "@/env";


export interface MonthCount {
  month: string;
  count: number;
}


export const getUsers = async () => {
  const res = await db.query.user.findMany({
    where: isNotNull(user.emailVerified),
    columns: {
      createdAt: true,
    }
  })
  const result: Record<string, MonthCount[]> = {};
  res.forEach(user => {
    const date = toDate(user.createdAt)

    const year = format(date, 'yyyy')
    const month = format(date, 'MMMM')

    if (!result[year]) {
      result[year] = [];
    }
    const monthCount = result[year]?.find(mc => mc.month === month);
    if (monthCount) {
      monthCount.count++;
    } else {
      result[year]?.push({ month, count: 1 });
    }
  })
  return result
}

export const getUserByEmail = async (email: string) => {

  try {
    const res = await db.query.user.findFirst({
      with: {
        role: {}
      },
      where: eq(user.email, email)
    })
    return res
  } catch (error) {
    console.log('error', error)
  }

}

export const getUserById = async (id: string) => {
  try {
    const users = await db.query.user.findFirst({
      with: {
        role: {
          columns: {
            userRole: true,
            superAdmin: true,
            id: true
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

export const updateUser = async (id: string, data: { status?: UserStatus, name?: string; email?: string; image?: string, theme?: Theme }) => {
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
  return await (db.transaction(async tx => {

    const result = await tx.insert(user).values({
      ...data,
      createdById: env.SUPER_ADMIN_UUID
    }).returning({ userId: user.id })

    if (!result[0]) return new Error('Failed to create user')

    const roleResult = await tx.insert(role).values({
      // For now, by default, registration grants admin permissions, used for demonstrating the backend management system.
      userRole: UserRole.Enum.admin,
      userId: result[0].userId
    }).returning({ id: role.id })

    if (!roleResult[0]) return new Error('Failed to create role')
    /**------------------- For now, give all permissions to the admin user------------------------- */
    const menu = await tx.query.menuTable.findMany()
    const userMenuRecords = menu.map((menu) => ({
      userId: result[0]!.userId,
      menuId: menu.id,
    }));
    await tx.insert(userMenuTable).values(userMenuRecords).returning({ id: userMenuTable.id });
    /**-------------------------------------------- */
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

    const roleResult = await tx.insert(role).values({
      userId: result[0].userId
    }).returning({ id: role.id })
    if (!roleResult[0]) return new Error('Failed to create role')

    return result
  }))
}