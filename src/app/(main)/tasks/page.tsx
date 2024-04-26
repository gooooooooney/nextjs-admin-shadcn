import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import React from "react"
import { TasksTable } from "./_components/tasks-table"
import { TasksTableProvider } from "./_components/tasks-table-provider"
import { searchParamsSchema } from "@/schema/data/task"
import { Shell } from "@/components/layout/shell"
import { getTasks } from "./_lib/queries"
import { DateRangePicker } from "@/components/date-range-picker"


interface ProductPageProps {
  searchParams: Record<string, string | string[] | undefined>
}

const ProductPage = ({ searchParams }: ProductPageProps) => {
  const search = searchParamsSchema.parse(searchParams)

  const tasksPromise = getTasks(search)

  return (
    <Shell variant="sidebar" className="px-4">
      {/**
       * The `TasksTableProvider` is use to enable some feature flags for the `TasksTable` component.
       * Feel free to remove this, as it's not required for the `TasksTable` component to work.
       */}
      <TasksTableProvider>
        {/**
         * The `DateRangePicker` component is used to render the date range picker UI.
         * It is used to filter the tasks based on the selected date range it was created at.
         * The business logic for filtering the tasks based on the selected date range is handled inside the component.
         */}
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
           * Passing promises and consuming them using React.use for triggering the suspense fallback.
           * @see https://react.dev/reference/react/use
           */}
          <TasksTable tasksPromise={tasksPromise} />
        </React.Suspense>
      </TasksTableProvider>
    </Shell>
  )
}

export default ProductPage