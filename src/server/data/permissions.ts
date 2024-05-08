import { db } from "@/drizzle/db";
import { MenuWithChildren, user } from "@/drizzle/schema";
import { SQL, eq } from "drizzle-orm";
import { getMenuHierarchy } from '@/lib/array-util'
import { getMenusByUserId } from "./menu";


export const getUserPermissions = async ({ userId, email, menusWhere }: { userId?: string, email?: string, menusWhere?: SQL }) => {
  const where = userId ? eq(user.id, userId) : email ? eq(user.email, email) : undefined
  const res = await db.query.user.findFirst({
    where,
    columns: {
      id: true,
    },
    with: {
      role: {
        columns: {
          userRole: true,
          superAdmin: true
        },
      },
      createdUsers: true
    }
  })
  if (!res?.role) return null
  let menus = await getMenusByUserId(res.id)
  menus = getMenuHierarchy(menus as MenuWithChildren[]) 
  return {
    role: res.role,
    menus: menus as MenuWithChildren[],

  }
}


