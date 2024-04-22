import { db } from "@/drizzle/db";
import { verificationToken } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verification = await db.query.verificationToken.findFirst({
      where: eq(verificationToken.token, token)
    });

    return verification;
  } catch {
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verification = await db.query.verificationToken.findFirst({
      where: eq(verificationToken.email, email)
    });

    return verification;
  } catch {
    return null;
  }
}

export const deleteVerificationToken = async (
  id: string
) => {
  try {
    return await db.delete(verificationToken).where(eq(verificationToken.id, id)).returning();
  } catch {
    return null;
  }
}