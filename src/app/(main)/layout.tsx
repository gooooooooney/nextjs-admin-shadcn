import { Icons } from '@/components/icons';
import { Header } from '@/components/layout/header'
import { type MenuItem, Sidebar } from '@/components/layout/sidebar'
import React from 'react'


const routes: MenuItem[] = [
  {
    path: '/',
    label: "Dashboard",
    icon: <Icons.Home className="size-4" />
  },
  {
    path: '/orders',
    label: "Orders",
    icon: <Icons.ShoppingCart className='size-4' />,

    children: [
      {
        path: '/orders/management',
        label: "management",
      },
    ],
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
    path: '/users',
    label: 'users',
    icon: <Icons.Users className='size-4' />,
  },
  // {
  //   path: '/analytics',
  //   label: "Analytics",
  //   icon: <Icons.LineChart className='size-4' />,
  // }
];

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" min-h-screen w-full flex">
      <Sidebar routes={routes} />
      <div className="flex flex-col flex-1">
        <Header />
        <div className='relative h-full'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default layout