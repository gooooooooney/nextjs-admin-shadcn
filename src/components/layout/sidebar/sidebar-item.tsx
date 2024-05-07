import React from 'react';
import Link from 'next/link';

import { type MenuItem } from '.';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTriggerWithoutChevronIcon,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dropdown } from './dropdown';
import { Icons } from '@/components/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


type SidebarItemProps = {
  item: MenuItem;
  pathname: string;
  collapsed: boolean;
}
type ItemLinkProps = {
  item: MenuItem;
  pathname: string;
} & {
  collapsed?: boolean;
}

export const ItemLink = ({ item, collapsed, pathname }: ItemLinkProps) => {
  return (
    <Link
      className={cn(
        buttonVariants({
          variant: 'ghost',
          size: collapsed ? 'icon' : 'default',
        }),
        'flex w-full items-center gap-x-3.5 rounded-lg px-2.5 text-start text-sm ',
        !collapsed && '!justify-start',
        pathname === item.path ? 'bg-accent' : ''
      )}
      href={item.path ?? '/'}
    >

      {item.icon}
      <span
        className={cn('visible capitalize opacity-100 transition-all group-[[data-collapsed=true]]:opacity-0 group-[[data-collapsed=true]]:hidden')}
      >
        {item.label}
      </span>
    </Link>
  )
}

const SidebarItemWithTooltip = ({ item, collapsed, pathname }: SidebarItemProps) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          className={cn(
            buttonVariants({
              variant: 'ghost',
              size: collapsed ? 'icon' : 'default',
            }),
            'flex w-full items-center gap-x-3.5 rounded-lg px-2.5 text-start text-sm ',
            !collapsed && '!justify-start',
            pathname === item.path ? 'bg-accent' : ''
          )}
          href={item.path ?? '/'}
        >

          {item.icon}
          <span
            className={cn('visible capitalize opacity-100 transition-all group-[[data-collapsed=true]]:opacity-0 group-[[data-collapsed=true]]:hidden')}
          >
            {item.label}
          </span>
        </Link>
      </TooltipTrigger>

      <TooltipContent side='right'>
        {item.label}
      </TooltipContent>
    </Tooltip>
  )
}

const SidebarItemWithAccordion = ({ item, collapsed, pathname }: SidebarItemProps) => {
  return (
    <Accordion
      className="group-[[data-collapsed=true]]:hidden"
      type="single"
      collapsible
    >
      <AccordionItem className="border-none" value={item.label}>
        <AccordionTriggerWithoutChevronIcon asChild>
          <Button
            variant="ghost"
            type="button"
            className={cn(
              'flex w-full items-center justify-start gap-x-3.5 rounded-lg px-2.5  text-start text-sm '
            )}
          >
            {item.icon && <span className="!rotate-0">{item.icon}</span>}
            <span
              className={cn('opacity-100 capitalize transition-all group-[[data-collapsed=true]]:opacity-0 group-[[data-collapsed=true]]:hidden')}
            >
              {item.label}
            </span>
            <Icons.ChevronDown className="ml-auto size-4 shrink-0 transition-transform duration-200" />
          </Button>
        </AccordionTriggerWithoutChevronIcon>

        <AccordionContent className="ml-4 pb-0">
          <ul className="ps-3 pt-2">
            {item.children?.map((child) => (
              <SidebarItem
                collapsed={collapsed}
                pathname={pathname}
                key={child.label}
                item={child}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const SidebarItemWithDropdown = ({ item }: { item: MenuItem }) => {
  return (
    <Dropdown currentLable={item.label} items={item.children!}>
      <Button type="button" variant="ghost" size="icon">
        {item.icon}
      </Button>
    </Dropdown>
  )
}


export const SidebarItem = ({
  item,
  pathname,
  collapsed,
}: {
  pathname: string;
  collapsed: boolean;
  item: MenuItem;
}) => {
  if (item.children?.length) {
    return collapsed ?
      <SidebarItemWithDropdown item={item} />
      :
      <SidebarItemWithAccordion item={item} pathname={pathname} collapsed={collapsed} />
  }
  return collapsed ?
    <SidebarItemWithTooltip item={item} pathname={pathname} collapsed={collapsed} />
    :
    <ItemLink item={item} pathname={pathname} collapsed={collapsed} />
};
