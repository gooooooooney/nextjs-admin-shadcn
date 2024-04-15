
import { generateUUID } from "./utils";
import { getPasswordResetTokenByEmail } from "@/server/data/password-reset-token";
import { db } from "@/server/db";
import { getVerificationTokenByEmail } from "@/server/data/verification-token";
import { getNewEmailVerificationTokenByUserId } from "@/server/data/email-verification-token";
import { getRegisterVerificationTokenByEmail } from "@/server/data/signup-verification-token";


export const generatePasswordResetToken = async (email: string) => {
  const token = generateUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  });

  return passwordResetToken;
}

export const generateVerificationToken = async (email: string) => {
  const token = generateUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verficationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return verficationToken;
};

export const generateNewEmailVerificationToken = async (email: string, userId: string) => {
  const token = generateUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getNewEmailVerificationTokenByUserId(userId);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.newEmailVerificationToken.create({
    data: {
      userId,
      email,
      token,
      expires,
    }
  });

  return verificationToken;
};

export const generateRegisterEmailVerificationToken = async ({ email, username, adminId }: { email: string, username: string, adminId: string }) => {
  const token = generateUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getRegisterVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.registerVerificationToken.create({
    data: {
      email,
      adminId,
      name: username,
      token,
      expires,
    }
  });

  return verificationToken;
}
