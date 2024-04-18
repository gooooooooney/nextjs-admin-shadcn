import { Icons } from '@/components/icons';
import { Header } from '@/components/layout/header'
import { type MenuItem, Sidebar } from '@/components/layout/sidebar'
import { currentUser } from '@/lib/auth';
import { auth } from '@/server/auth';
import { getUserPermissions } from '@/server/data/permissions';
import { UserRole } from '@prisma/client';
import { LucideIcon } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import React from 'react'


const defaultRoutes: MenuItem[] = [
  {
    path: '/',
    label: "Dashboard",
    icon: <Icons.Home className="size-4" />
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: <Icons.Package className='size-4' />,
  },
  {
    path: '/settings',
    label: 'settings',
    icon: <Icons.Settings className='size-4' />,
  },
  {
    path: '/system',
    label: 'system',
    icon: <Icons.Package className='size-4' />,
    children: [
      {
        path: '/system/users',
        label: "System Users",
        icon: <Icons.Users className='size-4' />,
      },
    ],
  },
  {
    path: "/error",
    label: "error pages",
    icon: <Icons.AlertCircle className="size-4" />,
    children: [
      {
        path: "/error/404",
        label: "404",
        icon: <Icons.AlertTriangle className="size-4" />,

      },
      {
        path: "/error/500",
        label: "500",
        icon: <Icons.ShieldAlert className="size-4" />,
      },
    ],
  }
];
const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const permissions = await getUserPermissions(session?.user?.id);

  if (!permissions) return null;


  let routes = defaultRoutes
  if (permissions.role.userRole === UserRole.user) {
    routes = permissions.role.menus.map(menu => {
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
    routes.unshift(defaultRoutes[0]!)
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