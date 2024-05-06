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
  console.log(rows, "delete rows")
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

const updateMenuStatus = async ({
  status,
  row
}: {
  status?: any
  row: MenuWithChildren
}) => {
  row.children?.length ? row.children.map(async (child) => {
    await updateMenuStatus({
      status,
      row: child,
    })
  }) :
    await updateMenu({
      status,
      id: row.id
    })
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
          id: row.original.id,
          label,
          status: status as any,
          path,
        })
      )
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
