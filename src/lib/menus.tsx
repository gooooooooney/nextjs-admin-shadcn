import { Icons } from "@/components/icons";
import { MenuItem } from "@/components/layout/sidebar";

export const defaultRoutes: MenuItem[] = [
  {
    path: '/',
    label: "Dashboard",
    icon: <Icons.Home className="size-4" />
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: <Icons.Package className='size-4' />,
  },
  {
    path: '/settings',
    label: 'settings',
    icon: <Icons.Settings className='size-4' />,
  },
  {
    path: '/system',
    label: 'system',
    icon: <Icons.Package className='size-4' />,
    children: [
      {
        path: '/system/users',
        label: "System Users",
        icon: <Icons.Users className='size-4' />,
      },
      {
        path: '/system/menus',
        label: "System Menus",
        icon: <Icons.Menu className='size-4' />,
      }
    ],
  },
  {
    path: "/error",
    label: "error pages",
    icon: <Icons.AlertCircle className="size-4" />,
    children: [
      {
        path: "/error/404",
        label: "404",
        icon: <Icons.AlertTriangle className="size-4" />,

      },
      {
        path: "/error/500",
        label: "500",
        icon: <Icons.ShieldAlert className="size-4" />,
      },
    ],
  }
];
