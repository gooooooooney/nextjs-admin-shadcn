"use client"

import { MenuWithChildren } from "@/drizzle/schema"
import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"

import { CreateMenuDialog } from "./create-menu-dialog"
import { DeleteMenusDialog } from "./delete-menus-dialog"
import React from "react"

interface MenusTableToolbarActionsProps {
  table: Table<MenuWithChildren>
}

export function MenusTableToolbarActions({
  table,
}: MenusTableToolbarActionsProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteMenusDialog
          menus={table.getFilteredSelectedRowModel().rows}
          onSuccess={() => table.toggleAllPageRowsSelected(false)}
        />
      ) : null}
      <CreateMenuDialog open={open} onOpenChange={setOpen} >
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          New menu
        </Button>
      </CreateMenuDialog>
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
