import { Theme, UserRole } from "@prisma/client";
import { db } from "../db"
import { tryit } from "radash";
import { getEnhancedPrisma } from "../db/enhance";

export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({ where: { email } })
  } catch (error) {
    return null
  }
}

export const getUserById = async (id?: string) => {
  try {
    const user = await db.user.findUnique({ where: { id }, include: { role: { select: { userRole: true } } } });

    return user;
  } catch {
    return null;
  }
};

export const updateUser = async (id: string, data: { name?: string; email?: string; image?: string, theme?: Theme }) => {
  try {
    return await db.user.update({ where: { id }, data })
  } catch (error) {
    return null
  }
}

export const deleteUserById = async (id: string) => {
  const { db, user } = await getEnhancedPrisma();
  return tryit(db.user.update)({
    where: { id },
    data: { deletedAt: new Date(), deletedById: user?.id }
  })
}

export const deleteUsersByIds = async (ids: string[]) => {
  const { db, user } = await getEnhancedPrisma();
  return tryit(db.user.updateMany)({
    where: { id: { in: ids } }, data: {
      deletedAt: new Date(),
      deletedById: user?.id
    }
  })
}