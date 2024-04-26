"use client"

import * as React from "react"
import {
  DotsHorizontalIcon
} from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { User } from "@/types/model/user"
import { format } from "date-fns"
import { DeleteUsersDialog } from "./delete-users-dialog"

export function getColumns(): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'index',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} className="w-24 text-center" title="Index" />
      ),
      cell: ({ row }) => <div className="w-24 text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Username" />
      ),
      cell: ({ row }) => <div >{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div title="Email" >Email</div>
      ),
      cell: ({ row }) => <div >{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <p title="Role" >Role</p>
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") || {} as any

        const getVariant = () => {
          if (role.userRole === "admin") return "warning"
          if (role.userRole === "user") return "secondary"
          return "success"
        }
        return <Badge className="capitalize" variant={getVariant()}>{role.userRole}</Badge>
      },
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="EmailVerified" />
      ),
      cell: ({ row }) => {
        const emailVerified = row.getValue("emailVerified") as Date
        return emailVerified ? format(row.getValue("emailVerified") as Date, "yyyy-MM-dd HH:mm") : "N/A"
      },
      enableColumnFilter: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => format(cell.getValue() as Date, "yyyy-MM-dd HH:mm"),
      enableColumnFilter: false,
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => (
        <p>Created By</p>
      ),
      cell: ({ row }) => {
        const createdBy: User = row.getValue("createdBy") || { name: "System" }
        return <Badge className="truncate" variant={createdBy.name == 'System' ? 'success' : 'secondary'} >{createdBy.name}</Badge>
      },
      enableColumnFilter: false,
    },
    {
      accessorKey: "deletedBy",
      header: ({ column }) => (
        <p>DeletedBy By</p>
      ),
      cell: ({ row }) => {
        const deletedBy: User = row.getValue("deletedBy")

        return deletedBy && <Badge className="truncate" variant="destructive" >{deletedBy.name}</Badge>
      },
      enableColumnFilter: false,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
          React.useState(false)

        return (
          <>
            <DeleteUsersDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              users={[row]}
              showTrigger={false}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() => setShowDeleteTaskDialog(true)}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]
}
