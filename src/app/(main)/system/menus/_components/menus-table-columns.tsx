"use client"

import * as React from "react"
import { MenuType, MenuWithChildren, menu, } from "@/drizzle/schema"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"
import { cn, formatDate } from "@/lib/utils"
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

import { updateMenu } from "../_lib/actions"
import { getStatusIcon } from "../_lib/utils"
import { DeleteMenusDialog } from "./delete-menus-dialog"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { UpdateMenuSheet } from "./update-menu-sheet"
import { Icons } from "@/components/icons"
import { CreateMenuDialog } from "./create-menu-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useCopyToClipboard } from "usehooks-ts"
import { Badge } from "@/components/ui/badge"


export function getColumns(): ColumnDef<MenuWithChildren>[] {
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
          className="translate-y-0.5"
        />

      ),
      cell: ({ row }) => (

        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ table }) => (

        <div className="flex items-center">
          <Button
            size="icon"
            variant="ghost"
            className="size-5 mr-4"
            {...{
              onClick: table.getToggleAllRowsExpandedHandler(),
            }}
          >
            {table.getIsAllRowsExpanded() ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
          </Button>
          Id
        </div>
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
        return <div className="flex items-center" style={{
          paddingLeft: `${row.depth * 2}rem`,
        }}>
          {

            row.getCanExpand() ? (
              <Button
                size="icon"
                variant="ghost"
                className="size-5"
                {...{
                  onClick: row.getToggleExpandedHandler(),
                }}
              >
                {row.getIsExpanded() ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
              </Button>
            ) : <div className="w-5" />
          }
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="pure" onClick={handleCopy(id)}>
                {id.slice(0, 8) + "..."}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {id}
            </TooltipContent>
          </Tooltip>
        </div>
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Menu type" />
      ),
      cell: ({ row }) => {
        const type = row.getValue("type")
        const isDir = type === MenuType.Enum.dir
        const isMenu = type === MenuType.Enum.menu
        const variant = isDir ? "destructive" : isMenu ? "success" : "warning"
        return <Badge variant={variant} >{row.getValue("type")}</Badge>
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "label",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Label" />
      ),
      cell: ({ row }) => <div>{row.getValue("label")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = menu.status.enumValues.find(
          (status) => status === row.original.status
        )

        if (!status) return null

        const Icon = getStatusIcon(status)

        return (
          <div className="flex w-[6.25rem] items-center">
            <Icon
              className="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className={cn("capitalize", {
              "text-success": status === "active",
              "text-warning": status === "inactive",
            })}>{status}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "path",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Path" />
      ),
      cell: ({ cell }) => {
        const [copiedText, copy] = useCopyToClipboard()
        const path = cell.getValue() as string
        const handleCopy = (text: string) => () => {
          copy(text)
            .then(() => {
              toast.success("Copied to clipboard")
            })
            .catch(error => {
              toast.error("Failed to copy to clipboard")
            })
        }
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="pure" onClick={handleCopy(path)}>
                <span className="w-30 truncate">{path}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {path}
            </TooltipContent>
          </Tooltip>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const [showUpdateMenuSheet, setShowUpdateMenuSheet] =
          React.useState(false)
        const [showDeleteMenuDialog, setShowDeleteMenuDialog] =
          React.useState(false)
        const [showNewSubMenuDialog, setShowNewSubMenuDialog] =
          React.useState(false)

        return (
          <>
            <UpdateMenuSheet
              open={showUpdateMenuSheet}
              onOpenChange={setShowUpdateMenuSheet}
              menu={row.original}
            />
            <DeleteMenusDialog
              open={showDeleteMenuDialog}
              onOpenChange={setShowDeleteMenuDialog}
              menus={[row]}
              showTrigger={false}
            />
            <CreateMenuDialog
              showTrigger={false}
              currentMenu={row.original}
              open={showNewSubMenuDialog}
              onOpenChange={setShowNewSubMenuDialog}>
              <Button variant="outline" size="sm">
                Create Submenu
              </Button>
            </CreateMenuDialog>
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
                {
                  row.original.type === MenuType.Enum.dir && (
                    <DropdownMenuItem onSelect={() => setShowNewSubMenuDialog(true)}>
                      Create Submenu
                    </DropdownMenuItem>
                  )
                }
                <DropdownMenuItem onSelect={() => setShowUpdateMenuSheet(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={(value) => {
                        startUpdateTransition(() => {
                          toast.promise(
                            updateMenu(
                              {
                                status: value as MenuWithChildren["status"] as any,
                              },
                              row.original.id),
                            {
                              loading: "Updating...",
                              success: "Status updated",
                              error: (err) => getErrorMessage(err),
                            }
                          )
                        })
                      }}
                    >
                      {menu.status.enumValues.map((status) => (
                        <DropdownMenuRadioItem
                          key={status}
                          value={status}
                          className="capitalize"
                          disabled={isUpdatePending}
                        >
                          {status}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteMenuDialog(true)}
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
