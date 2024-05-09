"use client"

import * as React from "react"
import { menuTable as menuSchema, type Menu } from "@/drizzle/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"
import { Button } from "@/components/ui/button"
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

import { updateMenu } from "../_lib/actions"
import { updateMenuSchema, type UpdateMenuSchema } from "../_lib/validations"
import { Input } from "@/components/ui/input"

interface UpdateTaskSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  menu: Menu
}

export function UpdateMenuSheet({
  menu,
  onOpenChange,
  ...props
}: UpdateTaskSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateMenuSchema>({
    resolver: zodResolver(updateMenuSchema),
    defaultValues: {
      label: menu.label,
      path: menu.path,
      status: menu.status!,
      icon: menu.icon!,
    },
  })

  function onSubmit(input: UpdateMenuSchema) {
    startUpdateTransition(() => {
      toast.promise(
        updateMenu({
          ...input,
        }, menu.id),
        {
          loading: "Updating menuSchema...",
          success: () => {
            onOpenChange?.(false)
            return "Task updated"
          },
          error: (error) => {
            onOpenChange?.(false)
            return getErrorMessage(error)
          },
        }
      )
    })
  }

  return (
    <Sheet onOpenChange={onOpenChange} {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update menu</SheetTitle>
          <SheetDescription>
            Update the menu details and save the changes
          </SheetDescription>
        </SheetHeader>
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
                      placeholder="Label"
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
                      placeholder="Path"
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
                    <Input
                      placeholder="Icon"
                      {...field}
                    />
                  </FormControl>
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
                        {menuSchema.status.enumValues.map((item) => (
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
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isUpdatePending}>Save</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
