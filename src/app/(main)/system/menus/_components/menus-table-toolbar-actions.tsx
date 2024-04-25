import { type Table } from "@tanstack/react-table"

import { CreateTaskDialog } from "./create-menu-dialog"
import { DeleteTasksDialog } from "./delete-menus-dialog"
import { Task } from "@/drizzle/schema"

interface TasksTableToolbarActionsProps {
  table: Table<Task>
}

export function TasksTableToolbarActions({
  table,
}: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteTasksDialog
          tasks={table.getFilteredSelectedRowModel().rows}
          onSuccess={() => table.toggleAllPageRowsSelected(false)}
        />
      ) : null}
      <CreateTaskDialog prevTasks={table.getFilteredRowModel().rows} />
      {/**
       * Other actions can be added here.
       * For example, export, import, etc.
       */}
    </div>
  )
}
