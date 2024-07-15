import React, { Suspense } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import ThemeToggle from '@/components/theme-toggle'
import { UserDropdown } from './user-dropdown'
import { Icons } from '@/components/icons'
import { HeaderBreadcrumb } from './breadcrumb'
import { getLatestUser } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { getGithubStar } from '@/server/other'
import { Skeleton } from '@/components/ui/skeleton'



export const Header = async () => {

  const user = await getLatestUser()
  return (
    <header className=" flex h-[var(--header-height)] items-center gap-4 border-b bg-muted/20 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Icons.Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Icons.Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Icons.Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
            >
              <Icons.ShoppingCart className="h-5 w-5" />
              Orders
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </Link>
            <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Icons.Package className="h-5 w-5" />
              Products
            </Link>
            <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Icons.Users className="h-5 w-5" />
              Customers
            </Link>
            <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Icons.LineChart className="h-5 w-5" />
              Analytics
            </Link>
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our
                  support team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <HeaderBreadcrumb />
      </div>
      <Link href="https://github.com/gooooooooney/nextjs-admin-shadcn"
        className={cn(buttonVariants({
          variant: 'ghost',
        }),
          'space-x-2'
        )}
      >
        <Icons.Star className="size-4" />
        <span className='text-base'>Star on Github</span>
        <Suspense fallback={<Skeleton className='w-6 h-4' />}>
          <GithubStar />
        </Suspense>
      </Link>

      <ThemeToggle theme={user?.theme!} />
      <UserDropdown />
    </header>
  )
}


export const GithubStar = async () => {
  const star = await getGithubStar()
  return (
    <span className='text-base bg-primary/10 px-1  rounded-sm'>{star}</span>
  )
}

export const HeaderSkeleton = () => {
  return (
    <Skeleton className="h-[var(--header-height)] w-full" />
  )
}