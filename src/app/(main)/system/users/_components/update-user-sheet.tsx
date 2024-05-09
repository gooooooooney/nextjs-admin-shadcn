"use client"

import * as React from "react"
import { MenuWithChildren, User, } from "@/drizzle/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"
import { Button, LoadingButton } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { UpdateUsers, UpdateUsersSchema } from "../_lib/validations"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updateUser } from "@/action/user"
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/components/ui/credenza"
import { PermissionTree } from "./permission-tree"
import { MenuWithValue } from "@/types/model/menu"
import { useAction } from "next-safe-action/hooks"
import { assignMenusToUserAction } from "@/action/menu"
import { isExecuting } from "next-safe-action/status"


interface UpdateTaskSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  user: User
  menus: MenuWithValue[]
}

export function UpdateUserSheet({
  user,
  menus,
  onOpenChange,
  ...props
}: UpdateTaskSheetProps) {


  const [checked, setChecked] = React.useState<string[]>([]);

  React.useEffect(() => {
    setChecked(menus.map(node => node.value))

  }, [menus])

  const { status, execute } = useAction(assignMenusToUserAction, {
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },

  })

  const isSaveMenuPending = isExecuting(status)

  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateUsers>({
    resolver: zodResolver(UpdateUsersSchema),
    defaultValues: {
      name: user.name!,
      status: user.status!,
    },
  })

  function onSubmit(input: UpdateUsers) {
    startUpdateTransition(() => {
      toast.promise(
        updateUser(
          user.id,
          {
            name: input.name!,
            status: input.status!,
          }),
        {
          loading: "Updating userSchema...",
          success: () => {
            onOpenChange?.(false)
            return "user updated"
          },
          error: (error) => {
            onOpenChange?.(false)
            return getErrorMessage(error)
          },
        }
      )
    })
  }

  const handleSave = () => {
    const menuIds: string[] = [...checked]
    checked.forEach(id => {
      const menu = menus.find(menu => menu.id === id)
      if (menu?.parentId && !menuIds.includes(menu.parentId)) {
        menuIds.push(menu.parentId)
      }
    })
    execute({userId: user.id, menuIds})
  };

  return (
    <Sheet onOpenChange={onOpenChange} {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update User</SheetTitle>
          <SheetDescription>
            Update the user details and save the changes
          </SheetDescription>
        </SheetHeader>
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
                  <FormLabel>username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Path</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value!}
                      className="flex items-center space-x-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="active" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          active
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="inactive" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          inactive
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
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

        <Credenza>
          <CredenzaTrigger asChild>
            <Button>Menu permissions</Button>
          </CredenzaTrigger>
          <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Menu permissions</CredenzaTitle>
              <CredenzaDescription>
                Menu permissions assigned to users
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>
              <PermissionTree checked={checked} setChecked={setChecked} nodes={menus} />
            </CredenzaBody>
            <CredenzaFooter>
              <LoadingButton isPending={isSaveMenuPending} onClick={handleSave} variant="shine">Save</LoadingButton>
              <CredenzaClose asChild>
                <Button variant="secondary">Cancel</Button>
              </CredenzaClose>
            </CredenzaFooter>
          </CredenzaContent>
        </Credenza>
      </SheetContent>
    </Sheet>
  )
}
