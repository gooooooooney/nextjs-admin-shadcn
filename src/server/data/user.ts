import { db } from "../db"

export const getUserByEmail = async (email: string) => {
  try {
    return await db.user.findUnique({ where: { email } })
  } catch (error) {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};