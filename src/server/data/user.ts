import { Theme, UserRole } from "@prisma/client";
import { tryit } from "radash";
import { getEnhancedPrisma } from "../db/enhance";
import { db } from "@/drizzle/db";
import { eq, inArray } from "drizzle-orm";
import { user, role } from "@/drizzle/schema";
import { currentUser } from "@/lib/auth";

export const getUserByEmail = async (email: string) => {
  try {
    return await db.select().from(user).where(eq(user.email, email))
  } catch (error) {
    return null
  }
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
    return await db.update(user).set(data).where(eq(user.id, id)).returning({id: user.id})
    } catch (error) {
    return null
  }
}

export const deleteUserById = async (id: string) => {
  const userinfo = await currentUser()
  return tryit(db.update(user).set({
    deletedAt:( new Date()).toString(),  
    deletedById: userinfo?.id 
  }).where(eq(user!.id, id)).returning)({id: user.id})
  // ({
  //   where: { id },
  //   data: { deletedAt: new Date(), deletedById: user?.id }
  // })
}

export const deleteUsersByIds = async (ids: string[]) => {
  const userinfo = await currentUser()
  // return tryit(db.user.updateMany)({
  //   where: { id: { in: ids } }, data: {
  //     deletedAt: new Date(),
  //     deletedById: user?.id
  //   }
  // })
  db.update(user).set({
    deletedAt: (new Date()).toString(),
    deletedById: userinfo?.id
  }).where(inArray(user.id, ids)).returning({id: user.id})
}