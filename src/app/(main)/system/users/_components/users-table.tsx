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
} from "./users-table-columns"
import { UsersTableFloatingBar } from "./users-table-floating-bar"
import { useUsersTable } from "./users-table-provider"
import { UsersTableToolbarActions } from "./users-table-toolbar-actions"
import { getUsers } from "@/action/user"
import { User } from "@/types/model/user"

interface TasksTableProps {
  usersPromise: ReturnType<typeof getUsers>
}

export function UsersTable({ usersPromise }: TasksTableProps) {
  // Flags for showcasing some additional features. Feel free to remove it.
  const { enableAdvancedFilter, showFloatingBar } = useUsersTable()

  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data } = React.use(usersPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  const { table } = useDataTable({
    data: data?.data?.data! as User[],
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
          <UsersTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
        >
          <UsersTableToolbarActions table={table} />
        </DataTableToolbar>
      )}
      <DataTable
        title="Users"
        description="List of all users in the system."
        table={table}
        columns={columns}
        floatingBar={
          showFloatingBar ? <UsersTableFloatingBar table={table} /> : null
        }
      />
    </div>
  )
}
