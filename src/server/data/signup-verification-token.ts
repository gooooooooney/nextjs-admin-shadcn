import { db } from "@/drizzle/db";
import { registerVerificationToken } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getRegisterVerificationTokenByToken = async (
  token: string
) => {
  try {
    // const verificationToken = await db.registerVerificationToken.findUnique({
    //   where: { token }
    // });
    const verificationToken = await db.query.registerVerificationToken.findFirst({
      where: eq(registerVerificationToken.token, token)
    })

    return verificationToken;
  } catch {
    return null;
  }
}

export const getRegisterVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verificationToken = await db.query.registerVerificationToken.findFirst({
      where: eq(registerVerificationToken.email, email)
    })

    return verificationToken;
  } catch {
    return null;
  }
}

export const deleteRegisterVerificationToken = async (
  id: string
) => {
  try {
    return await db.delete(registerVerificationToken).where(eq(registerVerificationToken.id, id)).returning();
  } catch {
    return null;
  }
}