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
import { formatDate } from "@/lib/utils"
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
    options: [true, false].map((emailVerified) => ({
      label: emailVerified ? "Yes" : "No",
      value: emailVerified.toString(),
    })),
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
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Id" />
    //   ),
    //   cell: ({ row }) => <div >{row.getValue("id")}</div>,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
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
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div >{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        return <h2 className="capitalize">{(row.getValue("role") as any).userRole}</h2>
      },
    },
    // {
    //   accessorKey: "status",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Status" />
    //   ),
    //   cell: ({ row }) => {
    //     const status = StatusSchema.options.find(
    //       (status) => status === row.original.status
    //     )

    //     if (!status) return null

    //     return (
    //       <div className="flex w-[100px] items-center">
    //         {status === "canceled" ? (
    //           <CrossCircledIcon
    //             className="mr-2 size-4 text-muted-foreground"
    //             aria-hidden="true"
    //           />
    //         ) : status === "done" ? (
    //           <CheckCircledIcon
    //             className="mr-2 size-4 text-muted-foreground"
    //             aria-hidden="true"
    //           />
    //         ) : status === "inProgress" ? (
    //           <StopwatchIcon
    //             className="mr-2 size-4 text-muted-foreground"
    //             aria-hidden="true"
    //           />
    //         ) : status === "todo" ? (
    //           <QuestionMarkCircledIcon
    //             className="mr-2 size-4 text-muted-foreground"
    //             aria-hidden="true"
    //           />
    //         ) : (
    //           <CircleIcon
    //             className="mr-2 size-4 text-muted-foreground"
    //             aria-hidden="true"
    //           />
    //         )}
    //         <span className="capitalize">{status}</span>
    //       </div>
    //     )
    //   },
    //   filterFn: (row, id, value) => {
    //     return Array.isArray(value) && value.includes(row.getValue(id))
    //   },
    // },
    // {
    //   accessorKey: "priority",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Priority" />
    //   ),
    //   cell: ({ row }) => {
    //     const priority = PrioritySchema.options.find(
    //       (priority) => priority === row.original.priority
    //     )

    //     if (!priority) return null

    //     return (
    //       <div className="flex items-center">
    //         {priority === "low" ? (
    //           <ArrowDownIcon
    //             className="mr-2 size-4 text-muted-foreground"
    //             aria-hidden="true"
    //           />
    //         ) : priority === "medium" ? (
    //           <ArrowRightIcon
    //             className="mr-2 size-4 text-muted-foreground"
    //             aria-hidden="true"
    //           />
    //         ) : priority === "high" ? (
    //           <ArrowUpIcon
    //             className="mr-2 size-4 text-muted-foreground"
    //             aria-hidden="true"
    //           />
    //         ) : (
    //           <CircleIcon
    //             className="mr-2 size-4 text-muted-foreground"
    //             aria-hidden="true"
    //           />
    //         )}
    //         <span className="capitalize">{priority}</span>
    //       </div>
    //     )
    //   },
    //   filterFn: (row, id, value) => {
    //     return Array.isArray(value) && value.includes(row.getValue(id))
    //   },
    // },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
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
            {/* <DeleteTasksDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              tasks={[row]}
              showTrigger={false}
            /> */}
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
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {/* <DropdownMenuRadioGroup
                      value={row.original.role!.userRole as any}
                      onValueChange={(value) => {
                        startUpdateTransition(() => {
                          toast.promise(
                            updateTask({
                              id: row.original.id,
                              label: value as Task["label"],
                            }),
                            {
                              loading: "Updating...",
                              success: "Label updated",
                              error: (err) => getErrorMessage(err),
                            }
                          )
                        })
                      }}
                    >
                      {LabelSchema.options.map((label) => (
                        <DropdownMenuRadioItem
                          key={label}
                          value={label}
                          className="capitalize"
                          disabled={isUpdatePending}
                        >
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup> */}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
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
