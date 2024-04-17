import {  Link } from "@/components/ui/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ResetPasswordForm } from "./_components/reset-form"
import { Suspense } from "react"

export default function ResetPassword() {
  return (
    <Card className="mx-auto  min-w-[90%] md:min-w-96 max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your registered email and
          we will send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={null}>
          <ResetPasswordForm />
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
