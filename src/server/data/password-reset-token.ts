import { db } from "@/drizzle/db";
import { passwordResetToken } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordReset = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token)
    });

    return passwordReset;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordReset = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email)
    });

    return passwordReset;
  } catch {
    return null;
  }
};

export const deletePasswordResetToken = async (id: string) => {
  try {
    return await db.delete(passwordResetToken).where(eq(passwordResetToken.id, id)).returning();
  } catch {
    return null;
  }
}