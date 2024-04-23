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
  console.log(env.NODE_ENV, "env.NODE_ENV")
  if (env.NODE_ENV === "development") {
    return { success: "Please check your email for the confirmation link.", link: confirmLink }
  }
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
  return { success: "Please check your email for the confirmation link." }

};


export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<{ success?: string, error?: string, link?: string }> {
  const resetLink = `${domain}/new-password?token=${token}`

  const subject = "Reset your password";
  if (env.NODE_ENV === "development") {
    return { success: "Please check your email for the confirmation link.", link: resetLink }
  }
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
  return { success: "Reset email sent!" }
};

export async function sendRegisterEmail({
  email,
  token,
}: {
  email: string,
  token: string,
}): Promise<{ success?: string, error?: string, link?: string }> {
  const confirmLink = `${domain}/register?token=${token}`;

  const subject = "Register confirmation";
  if (env.NODE_ENV === "development") {
    return { success: "Please register using this link.", link: confirmLink}
  }
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject,
    react: <MagicLinkEmail magicLink={confirmLink} previewTitle={subject} />
  });
  if (error) {
    return { error: "Email server error" }
  }
  return { success: "Register email sent!" }

}

