import React from 'react';

import { type MenuItem } from '.';
import { SidebarItem } from './sidebar-item';
import { TooltipProvider } from '@/components/ui/tooltip';

type SidebarMenuProps = {
  routes: MenuItem[];
  collapsed: boolean;
  pathname: string;
};

export const SidebarMenu = ({
  pathname,
  routes,
  collapsed,
}: SidebarMenuProps) => {
  return (
    <div className='w-full group '
      data-collapsed={collapsed}
    >
      <TooltipProvider delayDuration={0}>

        <nav
          className=" grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2  w-full  p-6 pt-4"
          data-hs-accordion-always-open
        >
          <ul className="grid gap-y-1.5">
            {routes.map((item) => (
              <SidebarItem
                collapsed={collapsed}
                pathname={pathname}
                key={item.label}
                item={item}
              />
            ))}
          </ul>
        </nav>
      </TooltipProvider>
    </div>
  );
};
