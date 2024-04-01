import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type MenuItem } from '.';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type DropdownProps = React.PropsWithChildren<{
  items: MenuItem[];
  side?: 'left' | 'right' | 'top' | 'bottom';
  currentLable?: string;

}>;

export type DropdownSubProps = {
  trigger: React.ReactNode;
  items: MenuItem[];
};

export const Dropdown = ({
  children,
  side = 'right',
  items,
  currentLable
}: DropdownProps) => {
  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='right'>
          {currentLable}
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side={side} className="z-[61] w-56">
        {items.map((item) =>
          item.children ? (
            <DropdownSub
              trigger={item.label}
              key={item.label}
              items={item.children}
            />
          ) : (
            <DropdownMenuItem key={item.label}>{item.label}</DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DropdownSub = ({ trigger, items }: DropdownSubProps) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{trigger}</DropdownMenuSubTrigger>
      <DropdownMenuSubContent sideOffset={8}>
        {items.map((item) =>
          item.children ? (
            <DropdownSub
              trigger={item.label}
              key={item.label}
              items={item.children}
            />
          ) : (
            <DropdownMenuItem key={item.label}>{item.label}</DropdownMenuItem>
          )
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
