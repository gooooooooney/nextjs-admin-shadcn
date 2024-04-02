import { deleteTask } from "@/action/task"
import { getErrorMessage } from "@/lib/handle-error"
import { type Task } from "@/types/model/task"
import { type Row } from "@tanstack/react-table"
import { toast } from "sonner"

export function deleteTasks({
  rows,
  onSucess,
}: {
  rows: Row<Task>[]
  onSucess?: () => void
}) {
  toast.promise(
    Promise.all(
      rows.map(async (row) =>
        deleteTask({
          id: row.original.id,
        })
      )
    ),
    {
      loading: "Deleting...",
      success: () => {
        onSucess?.()
        return "Tasks deleted"
      },
      error: (err) => getErrorMessage(err),
    }
  )
}