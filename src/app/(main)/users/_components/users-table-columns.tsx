"use client"

import * as React from "react"
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types/data-table"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"
import { Badge, type BadgeVariant } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
// import { DeleteTasksDialog } from "./delete-users-dialog"
import { LabelSchema, PrioritySchema, StatusSchema, UserRoleSchema } from "@/schema/zod/enums"
import { type Task } from "@/types/model/task"
import { updateTask } from "@/action/task"
import { User } from "@/types/model/user"
import { format } from "date-fns"
import { DeleteUsersDialog } from "./delete-users-dialog"

export const searchableColumns: DataTableSearchableColumn<User>[] = [
  {
    id: "name",
    placeholder: "Filter username...",
  },
]

export const filterableColumns: DataTableFilterableColumn<User>[] = [
  {
    id: "role",
    title: "Role",
    options: UserRoleSchema.options.map((userRole) => ({
      label: userRole[0]?.toUpperCase() + userRole.slice(1),
      value: userRole,
    })),
  },
  {
    id: "emailVerified",
    title: "isEmailVerified",
    options: [
      { label: "Yes", value: "1" },
      { label: "No", value: "0" },
    ],
  },
]

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
        return <h2 className="capitalize">{role.userRole}</h2>
      },
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="EmailVerified" />
      ),
      cell: ({ row }) => {
        const emailVerified = row.getValue("emailVerified") as Date
        return emailVerified ? format(row.getValue("emailVerified") as Date, "PPpp") : "N/A"
      },
      enableColumnFilter: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => format(cell.getValue() as Date, "PPpp"),
      enableColumnFilter: false,
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => (
        <p>Created By</p>
      ),
      cell: ({ row }) => {
        const createdBy: User = row.getValue("createdBy") || { name: "System" }
        return <div >{createdBy.name}</div>
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
                <DropdownMenuSeparator />
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
