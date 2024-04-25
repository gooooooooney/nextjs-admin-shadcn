import {
  type NextAuthConfig,
  type DefaultSession,
} from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/drizzle/db";
import { MenuWithChildren, UserRole, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { NextResponse } from "next/server";
import { authRoutes } from "./routes";
import { getMatchMenus } from "@/lib/compare";
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
      roleId: string;
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
  callbacks: {
    async authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname
      
      const isPublicRoute = authRoutes.includes(pathname);

      if (isPublicRoute || pathname.startsWith("/api")) return true

      if (!auth?.user) return false
      const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/get-user-permission?email=${auth?.user.email}`)
      const data = await res.json() as { menus: MenuWithChildren[], role: UserRole, superAdmin: boolean }

      if (data.superAdmin) return true

      const hasPermission = getMatchMenus(data.menus, pathname)
      if (!hasPermission) {
        return NextResponse.redirect(new URL("/not-found", request.url))
      }

      return true
    }
  },
  // we will add more providers later, because bcrypt relies on Node.js APIs not available in Next.js Middleware.
  // https://nextjs.org/learn/dashboard-app/adding-authentication
  providers: []
} satisfies NextAuthConfig


