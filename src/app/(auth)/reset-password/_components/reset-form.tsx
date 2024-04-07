"use client"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-succcess"
import { ResetSchema } from "@/schema/auth"
import { reset } from "@/action/auth"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"
import { useAction } from "next-safe-action/hooks"
import { isExecuting } from "next-safe-action/status"




export const ResetPasswordForm = () => {

    // const callbackUrl = searchParams.get("callbackUrl");
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");


    const { execute, status } = useAction(reset, {
        onSuccess: (res) => {
            if (res?.error) {
                form.reset();
                setError(res.error);
            } else if (res?.success) {
                form.reset();
                setSuccess(res?.success);
                res.link && toast.success(<Link href={res.link}>
                    Reset password now
                </Link>)
            }
        },
        onError: () => {
            setError("Something went wrong")
        }
    });

    const isPending = isExecuting(status);
    const form = useForm<ResetSchema>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: ResetSchema) {
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
                                        placeholder="email"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" disabled={isPending}
                        className="w-full">
                        {isPending && <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send reset email
                    </Button>
                </form>
            </Form>
        </>

    )
}

