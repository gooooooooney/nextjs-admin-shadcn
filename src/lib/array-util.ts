import { MenuWithChildren } from "@/drizzle/schema";

export function getMenuHierarchy(menus: MenuWithChildren[]): MenuWithChildren[] {
  const menuMap: Record<string, MenuWithChildren> = {};

  // 首先，初始化每个菜单项，并将其存储在map中
  menus.forEach(menu => {
    menu.children = [];
    menuMap[menu.id] = menu;
  });

  // 然后，根据parentId将每个菜单项放入其父菜单的children数组
  const rootMenus: MenuWithChildren[] = [];
  menus.forEach(menu => {
    if (menu.parentId) {
      const parent = menuMap[menu.parentId];
      if (parent) {
        parent.children.push(menu);
      }
    } else {
      rootMenus.push(menu);
    }
  });

  return rootMenus;
}