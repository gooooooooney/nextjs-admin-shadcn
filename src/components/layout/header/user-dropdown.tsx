import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { currentUser } from '@/lib/auth'
import Link from 'next/link'
import React from 'react'
import { LogoutButton } from './logout-button'

export const UserDropdown = async () => {
  const user = await currentUser()
  return (
    user ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image ?? ""} alt="@shadcn" />
              <AvatarFallback>{user?.name?.slice(0, 2).toLocaleUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Icons.Settings className="size-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <LogoutButton>
            <DropdownMenuItem>
              <Icons.ExitIcon className="size-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </LogoutButton>

        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <Button asChild size="sm">
        <Link href="/login">
          Login
        </Link>
      </Button>
    )
  )
}