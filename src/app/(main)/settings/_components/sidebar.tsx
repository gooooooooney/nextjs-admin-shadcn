"use client"
import { Icons } from "@/components/icons"
import { MenuItem } from "@/components/layout/sidebar"
import { ItemLink } from "@/components/layout/sidebar/sidebar-item"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

export const Sidebar = () => {
  const pathname = usePathname()
  const items: MenuItem[] = [
    {
      label: "Profile",
      icon: <Icons.User className="size-4" />,
      path: "/settings",
    },
    {
      label: "Account",
      icon: <Icons.Wrench className="size-4" />,
      path: "/settings/account",
    },
    {
      label: "Notifications",
      icon: <Icons.Bell className="size-4" />,
      path: "/settings/notifications",
    },
    {
      label: "Appearance",
      icon: <Icons.Palette className="size-4" />,
      path: "/settings/appearance",
    },
  ]
  return (
    <ul className="flex flex-col gap-y-1">
      {items.map((item, index) => (
        <li key={index}>
          <ItemLink item={item} pathname={pathname} />
        </li>
      ))}
    </ul>
  )
}

