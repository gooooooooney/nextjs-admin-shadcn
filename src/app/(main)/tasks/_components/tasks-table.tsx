"use client"

import React from "react"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTableAdvancedToolbar } from "@/components/ui/data-table/advanced/data-table-advanced-toolbar"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"

import {
  filterableColumns,
  getColumns,
  searchableColumns,
} from "./tasks-table-columns"
import { TasksTableFloatingBar } from "./tasks-table-floating-bar"
import { useTasksTable } from "./tasks-table-provider"
import { TasksTableToolbarActions } from "./tasks-table-toolbar-actions"
import { type getTasks } from "@/action/task"

interface TasksTableProps {
  tasksPromise: ReturnType<typeof getTasks>
}

export function TasksTable({ tasksPromise }: TasksTableProps) {
  // Flags for showcasing some additional features. Feel free to remove it.
  const { enableAdvancedFilter, showFloatingBar } = useTasksTable()

  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data } = React.use(tasksPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data: data?.data?.data ?? [],
    columns,
    pageCount: data?.data?.total ?? -1,
    searchableColumns,
    filterableColumns,
    enableAdvancedFilter,
  })

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      {enableAdvancedFilter ? (
        <DataTableAdvancedToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
        >
          <TasksTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
        >
          <TasksTableToolbarActions table={table} />
        </DataTableToolbar>
      )}
      <DataTable
        table={table}
        columns={columns}
        floatingBar={
          showFloatingBar ? <TasksTableFloatingBar table={table} /> : null
        }
      />
    </div>
  )
}