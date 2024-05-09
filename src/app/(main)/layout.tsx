import { Icons } from '@/components/icons';
import { Header } from '@/components/layout/header'
import { type MenuItem, Sidebar } from '@/components/layout/sidebar'
import { MenuWithChildren } from '@/drizzle/schema';
import { auth } from '@/server/auth';
import { getUserPermissions } from '@/server/data/permissions';
import { LucideIcon } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import React from 'react'

function buildMenu(menus: MenuWithChildren[]): MenuItem[] {
  return menus.map(menu => {
    const Icon = Icons[menu.icon as keyof typeof Icons] as LucideIcon || Icons.Package
    return {
      path: menu.path,
      label: menu.label,
      icon: <Icon className='size-4' />,
      children: menu.children.length > 0 ? buildMenu(menu.children) : []
    }
  }
  )
}


const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const permissions = await getUserPermissions({ userId: session?.user?.id });

  if (!permissions) return null;


  const routes = buildMenu(permissions.menus)

  return (
    <SessionProvider session={session}>
      <div className=" min-h-screen w-full flex">
        <div className="sticky bg-background top-0 h-screen z-[49]">
          <Sidebar routes={routes} />
        </div>
        <div className="flex flex-col flex-1">
          <div className="sticky bg-background top-0 z-[49]">
            <Header />
          </div>
          <div className='relative h-full'>
            {children}
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}

export default layout