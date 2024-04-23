import {
  type NextAuthConfig,
  type DefaultSession,
} from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/drizzle/db";
import { UserRole, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
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

  events: {
    async linkAccount({ user: userinfo }) {
      await db.update(user).set({
        emailVerified: new Date()
      }).where(eq(user.id, userinfo.id!))
    }
  },
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  // we will add more providers later, because bcrypt relies on Node.js APIs not available in Next.js Middleware.
  // https://nextjs.org/learn/dashboard-app/adding-authentication
  providers: []
} satisfies NextAuthConfig


