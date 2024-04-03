import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NewPasswordForm } from "./_components/new-password-form"
import { Suspense } from "react"

export default function ResetPassword() {
  return (
    <Card className="mx-auto min-w-[90%] md:min-w-96 max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={null}>
          <NewPasswordForm />
        </Suspense>
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="underline">
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
