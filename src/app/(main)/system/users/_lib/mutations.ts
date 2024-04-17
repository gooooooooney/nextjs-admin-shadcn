import { deleteTask, updateTask } from "@/action/task"
import { deleteUser, deleteUsersAction } from "@/action/user"
import { getErrorMessage } from "@/lib/handle-error"
import { updateUser } from "@/server/data/user"
import { type Task } from "@/types/model/task"
import { User } from "@/types/model/user"
import { Theme } from "@prisma/client"
import { type Row } from "@tanstack/react-table"
import { toast } from "sonner"

export function deleteUsers({
  rows,
  onSuccess,
}: {
  rows: Row<User>[]
  onSuccess?: () => void
}) {
  toast.promise(
    deleteUsersAction(rows.map((row) => row.original.id)),
    {
      loading: "Deleting...",
      success: (res) => {
        onSuccess?.()
        const err = res.data?.error
        if (err) {
          return getErrorMessage(err)
        }
        const count = res.data?.data?.count!
        
        return `${count === 1 ? 'user' : count + ' users'} deleted`
      },
      error: (err) => getErrorMessage(err),
    }
  )
}
