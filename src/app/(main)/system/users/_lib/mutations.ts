import { deleteUsersAction } from "@/action/user"
import { getErrorMessage } from "@/lib/handle-error"
import { User } from "@/types/model/user"
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
        const count = res.data?.data?.length
        
        return `${count === 1 ? 'user' : count + ' users'} deleted`
      },
      error: (err) => getErrorMessage(err),
    }
  )
}
