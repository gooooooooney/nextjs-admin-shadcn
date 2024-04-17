import {  Link } from "@/components/ui/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Suspense } from "react"
import { NewVerificationForm } from "./_components/new-verification-form"

export default function ConfirmEmail() {
  return (
    <Card className="mx-auto min-w-[90%] md:min-w-96 max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Confirming your verification</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={null}>
          <NewVerificationForm />
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
