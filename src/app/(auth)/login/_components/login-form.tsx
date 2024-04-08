"use client"
import { zodResolver } from "@hookform/resolvers/zod"

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAction } from "next-safe-action/hooks"
import { isExecuting } from "next-safe-action/status"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-succcess"
import { LoginSchema } from "@/schema/auth"
import { login } from "@/action/auth"
import { PasswordInput } from "@/components/ui/password-input"
import { LoadingButton } from "@/components/ui/button"




export const LoginForm = () => {

    const { execute, status } = useAction(login, {
        onSuccess: (res) => {
            if (res?.error) {
                // form.reset();
                setError(res.error);
            } else if (res?.success) {
                setSuccess(res?.success);
            }
        },
        onError: () => {
            setError("Something went wrong")
        }
    });

    const isPending = isExecuting(status);

    const searchParams = useSearchParams();
    // const callbackUrl = searchParams.get("callbackUrl");

    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    // 1. Define your form.
    const form = useForm<LoginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: LoginSchema) {
        setError("");
        setSuccess("");
        execute(values)

    }
    return (
        <>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"

                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        autoComplete="current-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    <Link href="/reset-password" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </Link>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormError message={error ?? urlError} />
                    <FormSuccess message={success} />
                    <LoadingButton isPending={isPending}
                        className="w-full">
                        Login
                    </LoadingButton>
                    {/* <Button variant="outline" className="w-full">
                        Login with Google
                    </Button> */}
                </form>
            </Form>
        </>

    )
}

