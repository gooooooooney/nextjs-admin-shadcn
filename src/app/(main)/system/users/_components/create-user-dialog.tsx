"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


import { getErrorMessage } from "@/lib/handle-error"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { type Task, } from "@/drizzle/schema"
import { type CreateUser, createUserSchema } from "@/schema/data/users"
import { User } from "@/types/model/user"
import { createByAdmin } from "@/action/auth"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useAction } from "next-safe-action/hooks"
import {  Link } from "@/components/ui/link"
import { isExecuting } from "next-safe-action/status"

interface CreateUserDialogProps {
  prevUsers: Row<User>[]
}



export function CreateUserDialog({ prevUsers }: CreateUserDialogProps) {
  const [open, setOpen] = React.useState(false)

  const { execute, status } = useAction(createByAdmin, {
    onError: (error) => {
      setOpen(false)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      toast.error(getErrorMessage(error))
    },
    onSuccess: (res) => {
      if (res.success) {
        if (res.link) {
          toast.success(<Link href={res.link as any}>{res.success}</Link>, {duration: 0})
        } else {
          toast.success(res.success)
        }
      }
      setOpen(false)
    },

  })

  const isPending = isExecuting(status)

  const user = useCurrentUser()
  const form = useForm<CreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
    }
  })

  function onSubmit(input: CreateUser) {
    const anotherUserId =
      prevUsers[Math.floor(Math.random() * prevUsers.length)]?.id

    if (!anotherUserId) return

    execute({
      email: input.email,
      username: input.name,
      adminId: user!.id,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          New User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            When you create a user, we will send an email to the email address you provided for this user, allowing them to register themselves.          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
