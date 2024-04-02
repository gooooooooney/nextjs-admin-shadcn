import React from 'react';

import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const SidebarHeader = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <>
      <div className={cn("flex items-center", collapsed && "justify-center")}>
        <Icons.Package2 className={cn("size-6 font-semibold")} />
        <h1 className={cn("ml-2 opacity-100 visible block w-auto truncate transition-all", collapsed && " invisible hidden w-0")}>Nextjs Admin</h1>
      </div>
      <Separator className="mt-4" />
    </>
  );
};
