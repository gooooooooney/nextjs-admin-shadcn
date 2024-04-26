"use client"

import { MenuWithChildren } from "@/drizzle/schema"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateMenuDialog } from "./create-menu-dialog"
import { DeleteMenusDialog } from "./delete-menus-dialog"

interface MenusTableToolbarActionsProps {
  table: Table<MenuWithChildren>
}

export function MenusTableToolbarActions({
  table,
}: MenusTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteMenusDialog
          menus={table.getFilteredSelectedRowModel().rows}
          onSuccess={() => table.toggleAllPageRowsSelected(false)}
        />
      ) : null}
      <CreateMenuDialog prevMenus={table.getFilteredRowModel().rows} />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "menus",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, export, import, etc.
       */}
    </div>
  )
}
