import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { and, asc, count, desc, gte, lte, or } from "drizzle-orm"

import { GetTasksSchema } from '@/schema/data/task'
import { db } from "@/drizzle/db"
import { type Task, task } from "@/drizzle/schema"
import { filterColumn } from "@/lib/filter-column"

export async function getTasks(input: GetTasksSchema) {
  noStore()
  try {
    const {
      page,
      per_page,
      sort,
      title,
      status,
      priority,
      operator,
      from,
      to,
    } = input

    // Offset to paginate the results
    const offset = (page - 1) * per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Task | undefined, "asc" | "desc" | undefined]

    // Filter task by date range
    const fromDay = from ? new Date(from) : undefined
    const toDay = to ? new Date(to) : undefined

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(task)
        .limit(per_page)
        .offset(offset)
        .where(
          !operator || operator === "and"
            ? and(
              // Filter task by title
              title
                ? filterColumn({
                  column: task.title,
                  value: title,
                })
                : undefined,
              // Filter task by status
              !!status
                ? filterColumn({
                  column: task.status,
                  value: status,
                  isSelectable: true,
                })
                : undefined,
              // Filter task by priority
              !!priority
                ? filterColumn({
                  column: task.priority,
                  value: priority,
                  isSelectable: true,
                })
                : undefined,
              // Filter by createdAt
              fromDay && toDay
                ? and(
                  gte(task.createdAt, fromDay),
                  lte(task.createdAt, toDay)
                )
                : undefined
            )
            : or(
              // Filter task by title
              title
                ? filterColumn({
                  column: task.title,
                  value: title,
                })
                : undefined,
              // Filter task by status
              !!status
                ? filterColumn({
                  column: task.status,
                  value: status,
                  isSelectable: true,
                })
                : undefined,
              // Filter task by priority
              !!priority
                ? filterColumn({
                  column: task.priority,
                  value: priority,
                  isSelectable: true,
                })
                : undefined,
              // Filter by createdAt
              fromDay && toDay
                ? and(
                  gte(task.createdAt, fromDay),
                  lte(task.createdAt, toDay)
                )
                : undefined
            )
        )
        .orderBy(
          column && column in task
            ? order === "asc"
              ? asc(task[column])
              : desc(task[column])
            : desc(task.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(task)
        .where(
          !operator || operator === "and"
            ? and(
              // Filter task by title
              title
                ? filterColumn({
                  column: task.title,
                  value: title,
                })
                : undefined,
              // Filter task by status
              !!status
                ? filterColumn({
                  column: task.status,
                  value: status,
                  isSelectable: true,
                })
                : undefined,
              // Filter task by priority
              !!priority
                ? filterColumn({
                  column: task.priority,
                  value: priority,
                  isSelectable: true,
                })
                : undefined,
              // Filter by createdAt
              fromDay && toDay
                ? and(
                  gte(task.createdAt, fromDay),
                  lte(task.createdAt, toDay)
                )
                : undefined
            )
            : or(
              // Filter task by title
              title
                ? filterColumn({
                  column: task.title,
                  value: title,
                })
                : undefined,
              // Filter task by status
              !!status
                ? filterColumn({
                  column: task.status,
                  value: status,
                  isSelectable: true,
                })
                : undefined,
              // Filter task by priority
              !!priority
                ? filterColumn({
                  column: task.priority,
                  value: priority,
                  isSelectable: true,
                })
                : undefined,
              // Filter by createdAt
              fromDay && toDay
                ? and(
                  gte(task.createdAt, fromDay),
                  lte(task.createdAt, toDay)
                )
                : undefined
            )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}
