import { Header, HeaderSkeleton } from '@/components/layout/header'
import { Sidebar, SidebarSkeleton } from '@/components/layout/sidebar'
import { auth } from '@/server/auth';
import { SessionProvider } from 'next-auth/react';
import React, { Suspense } from 'react'




const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className=" min-h-screen w-full flex">
        <div className="sticky bg-background top-0 h-screen z-[49]">
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar userId={session?.user.id} />
          </Suspense>
        </div>
        <div className="flex flex-col flex-1">
          <div className="sticky bg-background top-0 z-[49]">
            <Suspense fallback={<HeaderSkeleton />}>
              <Header />
            </Suspense>
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