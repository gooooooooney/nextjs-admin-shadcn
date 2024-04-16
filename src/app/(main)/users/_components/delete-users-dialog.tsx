"use client"

import * as React from "react"
import { TrashIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { type Task } from "@/types/model/task"
import { deleteUsers } from "../_lib/mutations"
import { User } from "@/types/model/user"

interface DeleteUserDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  users: Row<User>[]
  onSuccess?: () => void
  showTrigger?: boolean
}

export function DeleteUsersDialog({
  users,
  onSuccess,
  showTrigger = true,
  ...props
}: DeleteUserDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({users.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{users.length}</span>
            {users.length === 1 ? "user" : " users"} from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={() => {
                console.log(111)
                startDeleteTransition(() => {
                  deleteUsers({
                    rows: users,
                    onSuccess: onSuccess,
                  })
                })
              }}
              disabled={isDeletePending}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
