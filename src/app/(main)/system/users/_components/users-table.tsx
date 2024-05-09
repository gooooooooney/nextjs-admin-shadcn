"use client"

import React from "react"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTableAdvancedToolbar } from "@/components/ui/data-table/advanced/data-table-advanced-toolbar"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"

import {
  getColumns,
} from "./users-table-columns"
import { UsersTableFloatingBar } from "./users-table-floating-bar"
import { useUsersTable } from "./users-table-provider"
import { UsersTableToolbarActions } from "./users-table-toolbar-actions"
import { getUsers } from "@/action/user"
import { User } from "@/types/model/user"
import { DataTableFilterField } from "@/types/data-table"
import { MenuWithValue } from "@/types/model/menu"
import { Menu } from "@/drizzle/schema"

interface TasksTableProps {
  usersPromise: ReturnType<typeof getUsers>,
  menus: Menu[]
}

export function UsersTable({ usersPromise, menus }: TasksTableProps) {

  const { featureFlags, setMenus } = useUsersTable()

  React.useEffect(() => {
    setMenus(menus.map((menu) => {
      const { icon, ...rest } = menu
      return { ...rest, value: menu.id }
    }))
  }, [menus])

  // Learn more about React.use here: https://react.dev/reference/react/use
  const { data } = React.use(usersPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])


  const filterFields: DataTableFilterField<User>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter names...",
    },
    {
      label: "Email",
      value: "email",
      placeholder: "Filter emails...",
    },
    {
      label: "isEmailVerified",
      value: "emailVerified",
      options: [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
    },
  ]

  const { table } = useDataTable({
    data: data?.data! as User[],
    columns,
    pageCount: data?.pageCount || -1,
    filterFields,
    enableAdvancedFilter: featureFlags.includes("advancedFilter"),
    defaultPerPage: 10,
    defaultSort: "createdAt.desc",
  })

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      {featureFlags.includes("advancedFilter") ? (
        <DataTableAdvancedToolbar table={table} filterFields={filterFields.slice(0, 2)}>
          <UsersTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar table={table} filterFields={filterFields}>
          <UsersTableToolbarActions table={table} />
        </DataTableToolbar>
      )}
      <DataTable
        table={table}
        floatingBar={
          featureFlags.includes("floatingBar") ? (
            <UsersTableFloatingBar table={table} />
          ) : null
        }
      />
    </div>
  )
}
