"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

const LoginButton = () => {
  const path = usePathname()
  const searchParams = useSearchParams()
  const from = encodeURIComponent(`${path}?${searchParams.toString()}`)
  return (
    <Button asChild size="sm" >
      <Link href={`/login?from=${from}`}>
        Login
      </Link>
    </Button >
  )
}

export { LoginButton }