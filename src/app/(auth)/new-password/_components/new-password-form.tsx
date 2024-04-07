"use client"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button, LoadingButton } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-succcess"
import { NewPasswordSchema } from "@/schema/auth"
import { newPassword } from "@/action/auth"
import { Icons } from "@/components/icons"
import { PasswordInput } from "@/components/ui/password-input"




export const NewPasswordForm = () => {

  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<NewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: NewPasswordSchema) {
    setError("");
    setSuccess("");

    console.log(values)
    startTransition(() => {
      newPassword(values, token!)
        .then((res) => {
          if (res?.error) {
            form.reset();
            setError(res.error);
          } else if (res?.success) {
            form.reset();
            setSuccess(res?.success);
          }
        })
        .catch(() => setError("Something went wrong"));
    })

  }
  return (
    <>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isPending}
                    id="password"
                    placeholder="********"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput
                    disabled={isPending}
                    id="password"
                    placeholder="********"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />
          <LoadingButton isPending={isPending}
            className="w-full">
            Reset password
          </LoadingButton>
        </form>
      </Form>
    </>

  )
}

