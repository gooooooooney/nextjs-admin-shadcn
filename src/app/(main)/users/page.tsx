import { Shell } from "@/components/layout/shell"
import { currentUser } from "@/lib/auth"
import { getUsers } from "@/server/data/user"
import React from "react"

const UsersPage = async () => {
  const user = await currentUser()
  const users = await getUsers({ user: { id: user!.id, role: user?.role }, superAdmin: user?.superAdmin })

  console.log({ users })
  return (
    <Shell variant="sidebar" className="px-4">
      <TasksTableProvider>
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
          <TasksTable tasksPromise={tasksPromise} />
        </React.Suspense>
      </TasksTableProvider>
    </Shell>
  )
}

export default UsersPage