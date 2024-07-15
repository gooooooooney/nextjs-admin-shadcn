import { Icons } from "@/components/icons";
import { MenuWithChildren, session } from "@/drizzle/schema";
import { getUserPermissions } from "@/server/data/permissions";
import { LucideIcon } from "lucide-react";
import { MenuItem, SidebarContainer } from "./sidebar-container";
import { Skeleton } from "@/components/ui/skeleton";

function buildMenu(menus: MenuWithChildren[]): MenuItem[] {
  return menus.map(menu => {
    const Icon = Icons[menu.icon as keyof typeof Icons] as LucideIcon || Icons.Package
    return {
      path: menu.path,
      label: menu.label,
      icon: <Icon className='size-4' />,
      children: menu.children.length > 0 ? buildMenu(menu.children) : []
    }
  }
  )
}

export const Sidebar = async ({ userId }: { userId?: string }) => {
  const permissions = await getUserPermissions({ userId });

  if (!permissions) return null;


  const routes = buildMenu(permissions.menus)
  return <SidebarContainer routes={routes} />;
};

export const SidebarSkeleton = () => {
  return (
    <div className="h-screen w-72 border-r" >
      <div className="border-b">
        <Skeleton className="h-12 w-4/5 mx-auto my-4" />
      </div>
      <div className="mx-auto px-4 space-y-2 my-4">
        {
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-4/5 mx-auto" />
          ))
        }
      </div>
    </div>
  )
}
