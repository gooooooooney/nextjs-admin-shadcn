import { db } from "@/drizzle/db";
import { Menu, MenuWithChildren, menu, user } from "@/drizzle/schema";
import { SQL, eq } from "drizzle-orm";
import { getMenuHierarchy } from '@/lib/array-util'


export const getUserPermissions = async ({userId, email, menusWhere}: {userId?:string, email?:string, menusWhere?: SQL}) => {
  const where = userId ? eq(user.id, userId) : email ? eq(user.email, email) : undefined
  const res = await db.query.user.findFirst({
    where,
    columns: {},
    with: {
      role: {
        columns: {
          userRole: true,
          superAdmin: true
        },
        with: {
          menus: {
            where: menusWhere,
          },
          
        }
      },
      createdUsers: true
    }
  })
  if (!res?.role && !res?.role.menus) return null
  let menus = res.role.menus.map(menu => ({
    ...menu,
    children: [] as MenuWithChildren[]
  }))
  menus = getMenuHierarchy(menus as MenuWithChildren[])
  return {
    role: {
      ...res.role,
      menus
    }
  }
}


