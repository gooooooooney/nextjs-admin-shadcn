import { authConfig } from "@/config/auth";
import { comparePassword } from "@/lib/compare";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserRole, user } from "@/drizzle/schema";
import { getUserById } from "./data/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token }) {
      if (!token?.sub) return token
      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.role = existingUser.role?.userRole
      token.image = existingUser.image
      token.superAdmin = existingUser.role?.superAdmin

      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub!;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      if (session.user) {
        session.user.superAdmin = token.superAdmin as boolean
        session.user.image = token.image as string
      }
      return session
    },
    redirect: () => "/"

  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) throw new Error("Missing credentials");
        if (!credentials.email)
          throw new Error('"email" is required in credentials');
        if (!credentials.password)
          throw new Error('"password" is required in credentials');

        const maybeUser = await db.query.user.findFirst({
          where: eq(user.email, credentials.email as string),
          columns: {
            id: true,
            email: true,
            password: true,
            name: true,

          },
          with: {
            role: {
              columns: {
                userRole: true,
                superAdmin: true,
              }
            }
          }
        });


        if (!maybeUser?.password) return null;
        const password = credentials.password as string

        // verify the input password with stored hash
        const isValid = await comparePassword(password, maybeUser.password);
        if (!isValid) return null;
        return {
          id: maybeUser.id,
          email: maybeUser.email,
          name: maybeUser.name,
          role: maybeUser.role?.userRole,
          superAdmin: maybeUser.role?.superAdmin,
        };
      },
    }),
  ],
})

