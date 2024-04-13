import { Menu } from "@prisma/client";
import { db } from "../db"

export const getNestedMenus = async (id: string) => {
  const menus = await db.menu.findUnique({
    where: { id: id },
    include: { children: true },
  });

  if (!menus) {
    return null;
  }

  const nestedBlock = {
    ...menus,
    children: [] as typeof menus['children'],
  };

  for (const childBlock of menus.children) {
    const nestedChild = await getNestedMenus(childBlock.id);

    nestedChild && nestedBlock.children.push(nestedChild);
  }

  return nestedBlock;
}

export const getUserPermissions = async (userId?: string) => {
  const res = await db.user.findUnique({
    where: { id: userId },
    select: {
      role: {
        include: {
          menus: true
        }
      }
    }
  })
  if (!res?.role) return null
  const menus = res.role.menus.map(menu => ({
    ...menu,
    children: [] as Menu[]
  }))
  for (const menu of menus) {
    const nestedMenus = await getNestedMenus(menu.id);
    if (!nestedMenus) continue;
    menu.children = nestedMenus?.children;
  }
  return {
    role: {
      ...res.role,
      menus
    }
  }
}