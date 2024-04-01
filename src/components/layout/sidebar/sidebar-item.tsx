import React from 'react';
import Link from 'next/link';

import { type MenuItem } from '.';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerWithoutChevronIcon,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dropdown } from './dropdown';
import { Icons } from '@/components/icons';

export const SidebarItem = ({
  item,
  pathname,
  collapsed,
}: {
  pathname: string;
  collapsed: boolean;
  item: MenuItem;
}) => {
  return item.children ? (
    <div>
      {collapsed && (
        <Dropdown items={item.children}>
          <Button type="button" variant="ghost" size="icon">
            {item.icon}
          </Button>
        </Dropdown>
      )}

      <Accordion
        className={cn({
          hidden: collapsed,
        })}
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
                className={cn('opacity-100 transition-all ', {
                  hidden: collapsed,
                  'opacity-0': collapsed,
                })}
              >
                {item.label}
              </span>
              <Icons.ChevronDown className="ml-auto size-4 shrink-0 transition-transform duration-200" />
            </Button>
          </AccordionTriggerWithoutChevronIcon>

          <AccordionContent className="ml-4 pb-0">
            <ul className="ps-3 pt-2">
              {item.children.map((child) => (
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
    </div>
  ) : (
    <li>
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
          className={cn('visible opacity-100 transition-all ', {
            hidden: collapsed,
            'opacity-0': collapsed,
          })}
        >
          {item.label}
        </span>
      </Link>
    </li>
  );
};
