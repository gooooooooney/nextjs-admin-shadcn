import "server-only"

import { auth } from "@/server/auth"
import { getUserById } from "@/server/data/user"

export const currentUser = async () => {
  const session = await auth()
  return session?.user
}

export const getLatestUser = async () => {
  const user = await currentUser()

  if (!user) return null

  return await getUserById(user.id)
}
