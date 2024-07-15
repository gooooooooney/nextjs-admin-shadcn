import { Button } from "@/components/ui/button"
import { UserLine } from "@/components/user-line"
import { getUsers } from "@/server/data/user"


export default async function Dashboard() {
  const users = await getUsers()
  return (
    <main className="flex h-svh justify-center items-center">
      {/* <pre>{JSON.stringify(users, null, 2)}</pre>
      <h1 className="text-[2rem] font-bold leading-tight">Coming soon...</h1> */}
      <UserLine data={users} />
    </main>
  )
}
