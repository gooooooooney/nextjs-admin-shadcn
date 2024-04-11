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
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/button"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-succcess"
import { PasswordInput } from "@/components/ui/password-input"
import { EmailSchema } from "@/schema/settings"
import { updateEmail, updateProfile } from "@/action/user"
import { useAction } from "next-safe-action/hooks"
import { isExecuting } from "next-safe-action/status"
import { Label } from "@/components/ui/label"


type EmailFormProps = {
    initialValues: Omit<EmailSchema, "password">
}

export const EmailForm = ({ initialValues }: EmailFormProps) => {

    const { execute, status } = useAction(updateEmail, {
        onSuccess: (data) => {
            if (data.error) {
                setError(data.error);
            } else if (data.success) {
                setSuccess(data.success);
            }
        }
    })
    const isPending = isExecuting(status);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<EmailSchema>({
        resolver: zodResolver(EmailSchema),
        defaultValues: {
            email: '',
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: EmailSchema) {
        setError("");
        setSuccess("");
        if (values.email === initialValues.email) {
            setError("The email is the same.");
            return;
        }
        execute(values)
    }
    return (
        <>

            <div className="mb-8 space-y-2">
                <Label>Current email</Label>
                <Input disabled={true} value={initialValues.email} />
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>New email</FormLabel>
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <LoadingButton isPending={isPending}>
                        Update Email
                    </LoadingButton>
                </form>
            </Form>
        </>

    )
}

