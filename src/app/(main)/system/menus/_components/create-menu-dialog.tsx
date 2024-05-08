"use client"

import * as React from "react"
import { menuTable, type Menu } from "@/drizzle/schema"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { createMenu } from "../_lib/actions"
import { createMenuSchema, type CreateMenuSchema } from "../_lib/validations"

interface CreateMenuDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  currentMenu?: Menu
  children: React.ReactNode
  showTrigger?: boolean
}

export function CreateMenuDialog({ currentMenu, children, showTrigger = true, ...props }: CreateMenuDialogProps) {
  const [isCreatePending, startCreateTransition] = React.useTransition()
  const form = useForm<CreateMenuSchema>({
    resolver: zodResolver(createMenuSchema),
  })

  function onSubmit(input: CreateMenuSchema) {
    startCreateTransition(() => {
      toast.promise(
        createMenu({
          ...input,
          path: currentMenu ? `${currentMenu.path}${input.path}` : input.path,
        },
          currentMenu?.id || null),
        {
          loading: "Creating menu...",
          success: () => {
            form.reset()
            props.onOpenChange?.(false)
            return "Menu created"
          },
          error: (error) => {
            props.onOpenChange?.(false)
            return getErrorMessage(error)
          },
        }
      )
    })
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {showTrigger && <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      }
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create menu</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new menu.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Do a kickflip"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Path</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="path"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="icon"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {menuTable.type.enumValues.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {menuTable.status.enumValues.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
              <Button disabled={isCreatePending}>Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
