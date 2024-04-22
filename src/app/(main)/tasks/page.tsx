import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import React from "react"
import { TasksTable } from "./_components/tasks-table"
import { TasksTableProvider } from "./_components/tasks-table-provider"
import { searchParamsSchema } from "@/schema/data/task"
import { Shell } from "@/components/layout/shell"
import { getTasks } from "./_lib/queries"


interface ProductPageProps {
  searchParams: Record<string, string | string[] | undefined>
}

const ProductPage = ({ searchParams }: ProductPageProps) => {
  const search = searchParamsSchema.parse(searchParams)

  const tasksPromise = getTasks(search)

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

export default ProductPage