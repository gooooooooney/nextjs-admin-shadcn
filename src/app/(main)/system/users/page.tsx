import { Shell } from "@/components/layout/shell"
import { currentUser } from "@/lib/auth"
import React from "react"
import { UsersTableProvider } from "./_components/users-table-provider"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { UsersTable } from "./_components/users-table"
import { searchParamsSchema } from "@/schema/data/users"
import { getUsers } from "@/action/user"
import { DateRangePicker } from "@/components/date-range-picker"
import { getMenuList } from "@/server/data/menu"


interface UserPageProps {
  searchParams: Record<string, string | string[] | undefined>
}

const UsersPage = async ({ searchParams }: UserPageProps) => {
  const search = searchParamsSchema.parse(searchParams)
  const menus = await getMenuList()

  const usersPromise = getUsers(search)
  return (
    <Shell variant="sidebar" className="px-4">
      <UsersTableProvider>
        <DateRangePicker
          triggerSize="sm"
          triggerClassName="ml-auto w-56 sm:w-60"
          align="end"
        />
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          {/**
         * The `TasksTable` component is used to render the `DataTable` component within it.
         * This is done because the table columns need to be memoized, and the `useDataTable` hook needs to be called in a client component.
         * By encapsulating the `DataTable` component within the `tasktableshell` component, we can ensure that the necessary logic and state management is handled correctly.
         */}
          <UsersTable menus={menus} usersPromise={usersPromise} />
        </React.Suspense>
      </UsersTableProvider>
    </Shell>
  )
}

export default UsersPage