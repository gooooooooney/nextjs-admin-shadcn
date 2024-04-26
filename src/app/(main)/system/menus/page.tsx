import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import React from "react"
import { MenusTable } from "./_components/menus-table"
import { MenusTableProvider } from "./_components/menus-table-provider"
import { Shell } from "@/components/layout/shell"
import { getMenus } from "./_lib/queries"
import { DateRangePicker } from "@/components/date-range-picker"
import { searchParamsSchema } from "./_lib/validations"


interface MenuPageProps {
  searchParams: Record<string, string | string[] | undefined>
}

const Menu = ({ searchParams }: MenuPageProps) => {
  const search = searchParamsSchema.parse(searchParams)

  const menusPromise = getMenus(search)

  return (
    <Shell variant="sidebar" className="px-4">

      <MenusTableProvider>

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
          <MenusTable tasksPromise={menusPromise} />
        </React.Suspense>
      </MenusTableProvider>
    </Shell>
  )
}

export default Menu