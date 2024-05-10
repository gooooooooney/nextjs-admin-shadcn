import { type Row } from "@tanstack/react-table"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"

import { deleteMenusAction, updateMenu } from "./actions"
import { MenuWithChildren } from "@/drizzle/schema"



export function deleteMenus({
  rows,
  onSucess,
}: {
  rows: Row<MenuWithChildren>[]
  onSucess?: () => void
}) {

  toast.promise(new Promise<string>(async (resolve, reject) => {
    deleteMenusAction({
      ids: rows.map((row) => row.original.id),
    }).then((res) => {
      if (res?.message) {
        reject(res.message)
      }
      resolve("Menus deleted")
    }).catch(reject)
  }),
    {
      loading: "Deleting...",
      success: (message) => {
        onSucess?.()
        return message
      },
      error: (err: any) => getErrorMessage(err),
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
