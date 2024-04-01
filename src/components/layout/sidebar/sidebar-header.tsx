import React from 'react';

import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { Link } from 'lucide-react';

export const SidebarHeader = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <>
      <div className="flex items-center">
        {/* <Logo /> */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Icons.Package2 className="h-6 w-6" />
        </Link>
        {!collapsed && <h1 className="ml-2">Acme Inc</h1>}
      </div>
      <Separator className="mt-4" />
    </>
  );
};
