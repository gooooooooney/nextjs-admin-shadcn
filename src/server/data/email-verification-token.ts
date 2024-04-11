import { db } from "../db";

export const getNewEmailVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await db.newEmailVerificationToken.findUnique({
      where: { token }
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
    const verificationToken = await db.newEmailVerificationToken.findFirst({
      where: { userId }
    });

    return verificationToken;
  } catch {
    return null;
  }
}