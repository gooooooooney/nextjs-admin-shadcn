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
import { UpdateUserSheet } from "./update-user-sheet"
import { MenuWithChildren } from "@/drizzle/schema"
import { getMenusByUserIdAction, getUserMenus } from "@/action/menu"
import { MenuWithValue } from "@/types/model/menu"
import { useAction } from "next-safe-action/hooks"
import { isExecuting } from "next-safe-action/status"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useCopyToClipboard } from "usehooks-ts"
import { toast } from "sonner"

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
      accessorKey: "id",
      header: ({ column }) => (
        <p>UID</p>
      ),
      cell: ({ row }) => {
        const [copiedText, copy] = useCopyToClipboard()
        const id = row.getValue("id") as string
        const handleCopy = (text: string) => () => {
          copy(text)
            .then(() => {
              toast.success("Copied to clipboard")
            })
            .catch(error => {
              toast.error("Failed to copy to clipboard")
            })
        }
        if (!id) return "System"
        return <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="pure" className="p-0" onClick={handleCopy(id)}>
              {id.slice(0, 8) + "..."}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {id}
          </TooltipContent>
        </Tooltip>
      },
      enableColumnFilter: false,
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
        const [copiedText, copy] = useCopyToClipboard()
        const createdBy = row.getValue("createdBy") as User
        const handleCopy = (text: string) => () => {
          copy(text)
            .then(() => {
              toast.success("Copied to clipboard")
            })
            .catch(error => {
              toast.error("Failed to copy to clipboard")
            })
        }
        if (!createdBy) return <Badge className="truncate capitalize">System</Badge>
        return <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="pure" className="p-0" onClick={handleCopy(createdBy.id)}>
              <Badge variant="success" className="truncate capitalize">{createdBy.name}</Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {createdBy.id}
          </TooltipContent>
        </Tooltip>
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

        return deletedBy ? <Badge className="truncate" variant="destructive" >{deletedBy.name}</Badge> : "N/A"
      },
      enableColumnFilter: false,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showDeleteUserDialog, setShowDeleteUserDialog] =
          React.useState(false)
        const [showUpdateUserDialog, setShowUpdateUserDialog] =
          React.useState(false)

        const [menus, setMenus] = React.useState<MenuWithValue[]>([])

        const { status, execute } = useAction(getMenusByUserIdAction, {
          onSuccess: (data) => {
            setMenus(data)
          }
        })
        const isPending = isExecuting(status)
        return (
          <>
            <UpdateUserSheet
              open={showUpdateUserDialog}
              onOpenChange={setShowUpdateUserDialog}
              user={row.original}
              menus={menus}
            />
            <DeleteUsersDialog
              open={showDeleteUserDialog}
              onOpenChange={setShowDeleteUserDialog}
              users={[row]}
              showTrigger={false}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onMouseOver={(e) => {
                    if (menus.length || isPending) return
                    execute({ userId: row.original.id })
                  }}
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() => setShowUpdateUserDialog(true)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowDeleteUserDialog(true)}
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
