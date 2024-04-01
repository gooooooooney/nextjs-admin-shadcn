'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export type MenuItem = {
  label: string;
  path?: string;
  icon?: React.JSX.Element;
  children?: MenuItem[];
};

export type SidebarProps = {
  routes: MenuItem[];
};

export const Sidebar = ({ routes }: SidebarProps) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div
      id="docs-sidebar"
      className={cn(
        'bg-background hidden border-e  pb-10 pt-4 transition-all lg:relative lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col ',
        {
          'lg:w-20': collapsed,
        }
      )}
    >
      <div className="px-6">
        <Link
          className="flex-none text-xl font-semibold"
          href="#"
          aria-label="Brand"
        >
          <SidebarHeader collapsed={collapsed} />
        </Link>
      </div>
      <SidebarMenu {...{ pathname, routes, collapsed, setCollapsed }} />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="bg-background absolute -right-3 top-5 z-[61] size-6 rounded-full shadow-lg"
      >
        <Icons.ChevronLeft
          className={cn('size-4 transition-transform', {
            'rotate-180': collapsed,
          })}
        />
      </Button>
    </div>
  );
};
