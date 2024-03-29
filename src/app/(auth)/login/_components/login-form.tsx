"use client"
import { zodResolver } from "@hookform/resolvers/zod"

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
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
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-succcess"
import { type LoginSchema, loginSchema } from "@/schema/auth"
import { login } from "@/action/auth"




export const LoginForm = () => {

    const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams();
    // const callbackUrl = searchParams.get("callbackUrl");

    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    // 1. Define your form.
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: LoginSchema) {
        setError("");
        setSuccess("");

        console.log(values)
        startTransition(() => {
            login(values)
                .then((res) => {
                    if (res.data?.error) {
                        form.reset();
                        setError(res.data.error);
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
                        name="email"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"

                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        id="password"
                                        type="password"
                                        placeholder="********"

                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    <Link href="#" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </Link>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormError message={error ?? urlError} />
                    <FormSuccess message={success} />
                    <Button type="submit" disabled={isPending}
                        className="w-full">
                        Login
                    </Button>
                    <Button variant="outline" className="w-full">
                        Login with Google
                    </Button>
                </form>
            </Form>
        </>

    )
}

