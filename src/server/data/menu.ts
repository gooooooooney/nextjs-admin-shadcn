import { db } from "@/drizzle/db"
import { userRelation, user as userTable } from "@/drizzle/schema"
import { menuTable, userMenuTable } from "@/drizzle/schema/menu"
import { eq } from "drizzle-orm"

export const getMenusByUserId = async (userId: string) => {
  const result = await db
    .select({
      menu: menuTable,
    })
    .from(userMenuTable)
    .where(eq(userMenuTable.userId, userId))
    .innerJoin(menuTable, eq(menuTable.id, userMenuTable.menuId))

  return result.map((r) => r.menu)
}

export async function assignMenusToUser(userId: string, menuIds: string[]) {
  const userMenuRecords = menuIds.map((menuId) => ({
    userId,
    menuId,
  }));

  await db.insert(userMenuTable).values(userMenuRecords);
}