import { auth } from "@/server/auth"

export const currentUser = async () => {
  const session = await auth()

  return session?.user
}