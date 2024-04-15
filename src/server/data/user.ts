import { Theme, UserRole } from "@prisma/client";
import { db } from "../db"
import { tryit } from "radash";

export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({ where: { email } })
  } catch (error) {
    return null
  }
}

export const getUserById = async (id?: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });

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

export const getUsers = async ({
  user,
  superAdmin
}: {
  user: {
    id: string,
    role?: UserRole
  }
  superAdmin?: boolean
}) => {
  // let where: NonNullable<Parameters<typeof db.user.findMany>[0]>['where'];
  if (superAdmin) {
    return await db.user.findMany({
      where: {
        NOT: {
          id: user.id
        }
      }
    })
  } 
  if (user.role === UserRole.admin) {
    const res = await db.user.findUnique({
      where: {
        id: user.id
      },
      select: {
        role: {
          select: {
            users: true
          }
        }
      }
    })
    return res?.role?.users
  }
}