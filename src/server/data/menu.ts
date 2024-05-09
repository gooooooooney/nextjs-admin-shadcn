import { db } from "@/drizzle/db"
import { menuTable, userMenuTable } from "@/drizzle/schema/menu"
import { eq } from "drizzle-orm"

export const getMenusByUserId = async (userId: string) => {
  const result = await db
    .select({
      menu: menuTable,
    })
    .from(userMenuTable)
    .where(eq(userMenuTable.userId, userId))
    .innerJoin(menuTable, eq(menuTable.id, userMenuTable.menuId));
  return result.map((r) => r.menu)
}

export const getMenuList = async () => {
  return await db.query.menuTable.findMany()
}

export async function assignMenusToUser(userId: string, menuIds: string[]) {
  const userMenuRecords = menuIds.map((menuId) => ({
    userId,
    menuId,
  }));
  return await db.transaction(async (tx) => {
    await tx.delete(userMenuTable).where(eq(userMenuTable.userId, userId));
    return await tx.insert(userMenuTable).values(userMenuRecords).returning({ id: userMenuTable.id });
  }
  );

}