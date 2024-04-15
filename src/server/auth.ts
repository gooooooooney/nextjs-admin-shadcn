import { authConfig } from "@/config/auth";
import { comparePassword } from "@/lib/compare";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { db } from "./db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
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

        const maybeUser = await db.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: {
              select: {
                userRole: true,
                superAdmin: true,
              }
            }
          },
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

