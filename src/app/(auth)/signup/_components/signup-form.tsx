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
import { Input } from "@/components/ui/input"
import { Button, LoadingButton } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-succcess"
import { SignupSchema } from "@/schema/auth"
import { signup } from "@/action/auth"
import { PasswordInput } from "@/components/ui/password-input"
import { toast } from "sonner"
import Link from "next/link"




export const SignupForm = () => {

    const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams();
    const router = useRouter()
    // const callbackUrl = searchParams.get("callbackUrl");

    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<SignupSchema>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: SignupSchema) {
        setError("");
        setSuccess("");

        startTransition(() => {
            signup(values)
                .then((res) => {
                    if (res.data?.error) {
                        setError(res.data.error);
                    }
                    if (res.data?.success) {
                        setSuccess(res.data.success);
                        if (res.data.link) {
                            toast.success(<Link href={res.data.link}>Click here to verify your email</Link>), {
                                duration: 0,
                            }
                        }
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
                        name="username"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isPending}
                                        id="name"
                                        placeholder="username"

                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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

                    <FormError message={error ?? urlError} />
                    <FormSuccess message={success} />
                    <LoadingButton isPending={isPending}
                        className="w-full">
                        Create an account
                    </LoadingButton>
                    {/* <Button variant="outline" className="w-full">
                        Sign up with GitHub
                    </Button> */}
                </form>
            </Form>
        </>

    )
}

