import { Icons } from '@/components/icons';
import { Header } from '@/components/layout/header'
import { type MenuItem, Sidebar } from '@/components/layout/sidebar'
import { UserRole } from '@/drizzle/schema';
import { defaultRoutes } from '@/lib/menus';
import { auth } from '@/server/auth';
import { getUserPermissions } from '@/server/data/permissions';
import { LucideIcon } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import React from 'react'



const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const permissions = await getUserPermissions({ userId: session?.user?.id });

  if (!permissions) return null;


  let routes = defaultRoutes
  if (permissions.role.userRole !== UserRole.Enum.superAdmin) {
    console.log(permissions.menus)
    routes = permissions.menus.map(menu => {
      const Icon = Icons[menu.icon as keyof typeof Icons] as LucideIcon || Icons.Package
      return {
        path: menu.path,
        label: menu.label,
        icon: <Icon className='size-4' />,
        children: menu.children.map(child => ({
          path: child.path,
          label: child.label,
        }))
      }
    }
    )
    // routes.unshift(defaultRoutes[0]!)
  }

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