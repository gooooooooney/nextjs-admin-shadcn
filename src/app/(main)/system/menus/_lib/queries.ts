import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { and, asc, count, desc, eq, gte, lte, or } from "drizzle-orm"

import { db } from "@/drizzle/db"
import { filterColumn } from "@/lib/filter-column"
import { GetMenusSchema } from "@/schema/data/menus"
import { Menu, MenuWithChildren, menu } from "@/drizzle/schema"
import { getNestedMenus } from "@/server/data/permissions"
import { currentUser } from "@/lib/auth"

export async function getMenus(input: GetMenusSchema ) {
  noStore()
  try {
    const {
      page,
      per_page,
      sort,
      label,
      operator,
      from,
      to,
    } = input

    const offset = (page - 1) * per_page
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Menu | undefined, "asc" | "desc" | undefined]

    // Filter task by date range
    const fromDay = from ? new Date(from) : undefined
    const toDay = to ? new Date(to) : undefined

    const userinfo = await currentUser()
    if (!userinfo) return { data: [], pageCount: 0 }

    const { data, total } = await db.transaction(async (tx) => {
      const where = () => [
        eq(menu.roleId, userinfo.roleId),
        label
          ? filterColumn({
            column: menu.label,
            value: label,
          })
          : undefined,
        // Filter by createdAt
        fromDay && toDay
          ? and(
            gte(menu.createdAt, fromDay),
            lte(menu.createdAt, toDay)
          )
          : undefined]
      const data = await tx
        .select()
        .from(menu)
        .limit(per_page)
        .offset(offset)
        .where(
          !operator || operator === "and"
            ? and(...where())
            : or(...where())
        )
        .orderBy(
          column && column in menu
            ? order === "asc"
              ? asc(menu[column])
              : desc(menu[column])
            : desc(menu.id)
        )
        console.log(data,'----------------')

      const menus = data.map(menu => ({
        ...menu,
        children: [] as Menu[]
      }))
      // for (const menu of menus) {
      //   const nestedMenus = await getNestedMenus(menu.id);
      //   if (!nestedMenus) continue;
      //   menu.children = nestedMenus?.children;
      // }
      const total = await tx
        .select({
          count: count(),
        })
        .from(menu)
        .where(
          !operator || operator === "and"
            ? and(...where())
            : or(...where())
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data: menus as MenuWithChildren[],
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}