"use client"
import { zodResolver } from "@hookform/resolvers/zod"

import { useCallback, useEffect, useState, useTransition } from 'react'
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
import { useSearchParams } from "next/navigation"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-succcess"
import { SignupByTokenSchema } from "@/schema/auth"
import { registerVerification, signup, signupByAdmin } from "@/action/auth"
import { PasswordInput } from "@/components/ui/password-input"
import { toast } from "sonner"
import {  Link } from "@/components/ui/link"




export const RegisterForm = () => {

    const [isPending, startTransition] = useTransition()

    const searchParams = useSearchParams();

    const token = searchParams.get("token");
    // const callbackUrl = searchParams.get("callbackUrl");

    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [email, setEmail] = useState<string | undefined>("");
    const [tokenError, setTokenError] = useState<string | undefined>("");



    const form = useForm<SignupByTokenSchema>({
        resolver: zodResolver(SignupByTokenSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
            username: "",
            token: ""
        },
    })

    const onVerifyToken = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setTokenError("Missing token, please use the link sent to your email to open.");
            return;
        }

        registerVerification(token)
            .then((data) => {
                if (data.error) {
                    toast.error(data.error, {
                        duration: 5000,
                    })
                } else if (data.data) {
                    setEmail(data.data.email);
                    form.setValue("token", token!);
                    form.setValue("username", data.data.username);
                }
            })
            .catch(() => {
                setError("Something went wrong!");
            })
    }, [token, success, error]);

    useEffect(() => {
        onVerifyToken();
    }, [onVerifyToken, token]);

    // 2. Define a submit handler.
    function onSubmit(values: SignupByTokenSchema) {
        setError("");
        setSuccess("");

        startTransition(() => {
            signupByAdmin(values)
                .then((res) => {
                    if (res.data?.error) {
                        setError(res.data.error);
                    }
                    if (res.data?.success) {
                        setSuccess(res.data.success);
                        
                    }

                })
                .catch(() => setError("Something went wrong"));
        })

    }
    if (tokenError) {
        return (
            <div className="flex items-center w-full justify-center">
                <FormError message={tokenError} />
            </div>
        )
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
                        name="email"
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"

                                        value={email}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="token"
                        render={({ field }) => (
                            <FormItem className="hidden">
                                <FormControl>
                                    <Input
                                        hidden
                                        className="hidden"
                                        disabled
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

