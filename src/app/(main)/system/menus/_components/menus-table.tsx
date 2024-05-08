"use client"

import React from "react"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTableAdvancedToolbar } from "@/components/ui/data-table/advanced/data-table-advanced-toolbar"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"

import {
  getColumns,
} from "./menus-table-columns"
import { MenusTableFloatingBar } from "./menus-table-floating-bar"
import { useMenusTable } from "./menus-table-provider"
import { MenusTableToolbarActions } from "./menus-table-toolbar-actions"
import { getMenus } from "../_lib/queries"
import { MenuWithChildren, menuTable } from "@/drizzle/schema"
import { DataTableFilterField } from "@/types/data-table"
import { getStatusIcon } from "../_lib/utils"

interface MenusTableProps {
  tasksPromise: ReturnType<typeof getMenus>
}

export function MenusTable({ tasksPromise }: MenusTableProps) {
  const { featureFlags } = useMenusTable()

  const { data, pageCount } = React.use(tasksPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<MenuWithChildren>[] = [
    {
      label: "Label",
      value: "label",
      placeholder: "Filter titles...",
    },
    {
      label: "Path",
      value: "path",
      placeholder: "Filter paths...",
    },
    {
      label: "Status",
      value: "status",
      options: menuTable.status.enumValues.map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        icon: getStatusIcon(status),
        withCount: true,
      })),
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    // optional props
    filterFields,
    enableAdvancedFilter: featureFlags.includes("advancedFilter"),
    defaultPerPage: 10,
    defaultSort: "createdAt.desc",
  })

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      {featureFlags.includes("advancedFilter") ? (
        <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
          <MenusTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar table={table} filterFields={filterFields}>
          <MenusTableToolbarActions table={table} />
        </DataTableToolbar>
      )}
      <DataTable
        table={table}
        floatingBar={
          featureFlags.includes("floatingBar") ? (
            <MenusTableFloatingBar table={table} />
          ) : null
        }
      />
    </div>
  )
}
