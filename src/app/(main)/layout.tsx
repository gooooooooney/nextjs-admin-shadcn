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
    path: '/products',
    label: 'Products',
    icon: <Icons.Package className='size-4' />,
  },
  {
    path: '/customers',
    label: 'Customers',
    icon: <Icons.Users className='size-4' />,
  },
  {
    path: '/analytics',
    label: "Analytics",
    icon: <Icons.LineChart className='size-4' />,
  }
];

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar routes={routes} />
      <div className="flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  )
}

export default layout