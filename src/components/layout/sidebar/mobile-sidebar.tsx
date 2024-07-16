'use client';
import { usePathname } from 'next/navigation';

import { SidebarMenu } from './sidebar-menu';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuItem } from './sidebar-container';

export function MobileSidebar({
  routes,
  children,
}: {
  children: React.ReactNode;
  routes: MenuItem[];
}) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-2/3 pl-0" side="left">
        <SidebarMenu pathname={pathname} collapsed={false} routes={routes} />
      </SheetContent>
    </Sheet>
  );
}
