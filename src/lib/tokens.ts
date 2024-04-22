
import { generateUUID } from "./utils";
import { getPasswordResetTokenByEmail } from "@/server/data/password-reset-token";
import { getVerificationTokenByEmail } from "@/server/data/verification-token";
import { getNewEmailVerificationTokenByUserId } from "@/server/data/email-verification-token";
import { getRegisterVerificationTokenByEmail } from "@/server/data/signup-verification-token";
import { newEmailVerificationToken, passwordResetToken, registerVerificationToken, verificationToken } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";


export const generatePasswordResetToken = async (email: string) => {
  const token = generateUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.delete(passwordResetToken).where(eq(passwordResetToken.id, existingToken.id));
  }

  const pwdResetToken = await db.insert(passwordResetToken).values({
    email,
    token,
    expires
  }).returning();

  return pwdResetToken[0]!;
}

export const generateVerificationToken = async (email: string) => {
  const token = generateUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(verificationToken).where(eq(verificationToken.id, existingToken.id));
  }

  const verification = await db.insert(verificationToken).values({
    email,
    token,
    expires,
  }).returning();

  return verification[0]!;
};

export const generateNewEmailVerificationToken = async (email: string, userId: string) => {
  const token = generateUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getNewEmailVerificationTokenByUserId(userId);

  if (existingToken) {
    await db.delete(newEmailVerificationToken).where(eq(newEmailVerificationToken.id, existingToken.id));
  }

  const verificationToken = await db.insert(newEmailVerificationToken).values({
    userId,
    email,
    token,
    expires,
  }).returning();

  return verificationToken[0]!;
};

export const generateRegisterEmailVerificationToken = async ({ email, username, adminId }: { email: string, username: string, adminId: string }) => {
  const token = generateUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getRegisterVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(registerVerificationToken).where(eq(registerVerificationToken.id, existingToken.id))
  }

  const verification = await db.insert(registerVerificationToken).values({
    email,
    adminId,
    name: username,
    token,
    expires,
  }).returning();

  return verification[0]!;
}
