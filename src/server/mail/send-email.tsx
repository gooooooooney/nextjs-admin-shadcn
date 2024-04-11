import { env } from "@/env";
import { domain, resend } from "./mail";
import { MagicLinkEmail } from "./templates/magic-link-email";

export async function sendVerificationEmail(
  {
    token,
    email,
    verificationPath = "new-verification"
  }: {
    email: string,
    token: string,
    verificationPath?: string
  },
): Promise<{ success?: string, error?: string, link?: string }> {
  const confirmLink = `${domain}/${verificationPath}?token=${token}`;

  const subject = "Confirm your email";
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject,
    react: <MagicLinkEmail magicLink={confirmLink} previewTitle={subject} />
  });
  if (error) {
    console.log(error)
    return { error: "Email server error" }
  }
  return { success: "Please check your email for the confirmation link.", link: env.NODE_ENV === "development" ? confirmLink : undefined }

};


export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<{ success?: string, error?: string, link?: string }> {
  const resetLink = `${domain}/new-password?token=${token}`

  const subject = "Reset your password";
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject,
    react: <MagicLinkEmail magicLink={resetLink} previewTitle={subject} />
  });

  if (error) {
    console.log(error)
    return { error: "Email server error" }
  }
  return { success: "Reset email sent!", link: env.NODE_ENV === "development" ? resetLink : undefined }
};

