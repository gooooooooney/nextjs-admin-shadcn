import { type Row } from "@tanstack/react-table"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"

import { deleteMenu, updateMenu } from "./actions"
import { MenuWithChildren } from "@/drizzle/schema"



export function deleteMenus({
  rows,
  onSucess,
}: {
  rows: Row<MenuWithChildren>[]
  onSucess?: () => void
}) {
  toast.promise(
    Promise.all(
      rows.map(async (row) =>
        deleteMenu({
          id: row.original.id,
        })
      )
    ),
    {
      loading: "Deleting...",
      success: () => {
        onSucess?.()
        return "Menus deleted"
      },
      error: (err) => getErrorMessage(err),
    }
  )
}


export function updateMenus({
  rows,
  label,
  status,
  path,
  onSucess,
}: {
  rows: Row<MenuWithChildren>[]
  label?: MenuWithChildren["label"]
  status?: MenuWithChildren["status"]
  path?: MenuWithChildren["path"]
  onSucess?: () => void
}) {
  toast.promise(
    Promise.all(
      rows.map(async (row) =>
        updateMenu({
          label,
          status: status as any,
          path,
        },
          row.original.id,
        )


      ),
    ),
    {
      loading: "Updating...",
      success: () => {
        onSucess?.()
        return "Menus updated"
      },
      error: (err) => getErrorMessage(err),
    }
  )
}
