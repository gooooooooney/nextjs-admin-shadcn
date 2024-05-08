import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { and, asc, count, desc, eq, gte, lte, or } from "drizzle-orm"

import { db } from "@/drizzle/db"
import { filterColumn } from "@/lib/filter-column"
import { GetMenusSchema } from "@/schema/data/menus"
import { Menu, MenuWithChildren, menuTable } from "@/drizzle/schema"
import { getMenuHierarchy } from '@/lib/array-util'




export async function getMenus(input: GetMenusSchema) {
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


    const { data, total } = await db.transaction(async (tx) => {
      const where = () => [
        label
          ? filterColumn({
            column: menuTable.label,
            value: label,
          })
          : undefined,
        // Filter by createdAt
        fromDay && toDay
          ? and(
            gte(menuTable.createdAt, fromDay),
            lte(menuTable.createdAt, toDay)
          )
          : undefined]
      const data = await tx
        .select()
        .from(menuTable)
        .limit(per_page)
        .offset(offset)
        .where(
          !operator || operator === "and"
            ? and(...where())
            : or(...where())
        )
        .orderBy(
          column && column in menuTable
            ? order === "asc"
              ? asc(menuTable[column])
              : desc(menuTable[column])
            : desc(menuTable.id)
        )

      let menus = data.map(menu => ({
        ...menu,
        children: [] as Menu[]
      }))
      menus = getMenuHierarchy(menus as MenuWithChildren[]);
      const total = await tx
        .select({
          count: count(),
        })
        .from(menuTable)
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