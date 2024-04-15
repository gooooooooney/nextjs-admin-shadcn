import { db } from "../db";

export const getRegisterVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await db.registerVerificationToken.findUnique({
      where: { token }
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export const getRegisterVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verificationToken = await db.registerVerificationToken.findFirst({
      where: { email }
    });

    return verificationToken;
  } catch {
    return null;
  }
}