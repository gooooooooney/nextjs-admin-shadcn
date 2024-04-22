import { db } from "@/drizzle/db";
import { newEmailVerificationToken } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getNewEmailVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await db.query.newEmailVerificationToken.findFirst({
      where: eq(newEmailVerificationToken.token, token)
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export const getNewEmailVerificationTokenByUserId = async (
  userId: string
) => {
  try {
    const verificationToken = await db.query.newEmailVerificationToken.findFirst({
      where: eq(newEmailVerificationToken.userId, userId)
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export const deleteNewEmailVerificationToken = async (
  id: string
) => {
  try {
    return await db.delete(newEmailVerificationToken).where(eq(newEmailVerificationToken.id, id)).returning();
  } catch {
    return null;
  }
}