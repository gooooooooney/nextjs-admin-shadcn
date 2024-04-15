import {
  type NextAuthConfig,
  type DefaultSession,
} from "next-auth";

import { db } from "@/server/db";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: UserRole;
      superAdmin: boolean;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub!;
      }
      return session;
    },
    redirect: () => "/"

  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  // we will add more providers later, because bcrypt relies on Node.js APIs not available in Next.js Middleware.
  // https://nextjs.org/learn/dashboard-app/adding-authentication
  providers: []
} satisfies NextAuthConfig


