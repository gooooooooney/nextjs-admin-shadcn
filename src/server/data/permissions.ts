import { db } from "@/drizzle/db";
import { Menu, menu, user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getNestedMenus = async (id: string) => {
  const menus = await db.query.menu.findFirst({
    where: eq(menu.id, id),
    with: {
      children: true,
    }
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
  const res = await db.query.user.findFirst({
    where: eq(user.id, userId!),
    columns: {},
    with: {
      role: {
        columns: {
          userRole: true,
        },
        with: {
          menus: true
        }
      },
      createdUsers: true
    }
  })
  if (!res?.role && !res?.role.menus) return null
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