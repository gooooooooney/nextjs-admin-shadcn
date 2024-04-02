"use server"

import { getErrorMessage } from "@/lib/handle-error"
import { action } from "@/lib/safe-action"
import { UpdateTaskSchema, getTasksSchema } from "@/schema/data/task"
import { TaskCreateSchema, TaskSchema } from "@/schema/zod/models"
import { db } from "@/server/db"
import { type ActionReturnValue } from "@/types/actions"
import { type Task, type TaskCreate } from "@/types/model/task"
import { revalidatePath } from "next/cache"
import { faker } from "@faker-js/faker"
import { customAlphabet } from "nanoid"
import { LabelSchema, PrioritySchema, StatusSchema } from "@/schema/zod/enums"
import { generateUUID } from "@/lib/utils"
import { $Enums } from "@prisma/client"



export const createTask = action<typeof TaskCreateSchema, ActionReturnValue<TaskCreate>>(TaskCreateSchema, async (params) => {
  try {
    const data = await db.task.create({
      data: params,
    })
    revalidatePath('/product')
    return { data, error: null }

  } catch (error) {
    return { error: getErrorMessage(error), data: null }

  }
})

const DeleteScheme = TaskSchema.pick({ id: true })

export const deleteTask = action<typeof DeleteScheme, ActionReturnValue<Task>>(DeleteScheme, async ({ id }) => {
  try {
    const data = await db.task.delete({
      where: { id },
    })
    revalidatePath('/products')
    return { data, error: null }
  } catch (error) {
    return { error: getErrorMessage(error), data: null }
  }
})

export const updateTask = action<typeof UpdateTaskSchema, ActionReturnValue<Task>>(UpdateTaskSchema, async ({ id, ...params }) => {
  try {
    const data = await db.task.update({
      where: { id },
      data: params,
    })
    revalidatePath('/products')
    return { data, error: null }
  } catch (error) {
    return { error: getErrorMessage(error), data: null }
  }
})

export const getTasks = action<typeof getTasksSchema, ActionReturnValue<{
  data: Task[],
  total: number,
}>>(getTasksSchema, async (params) => {
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
  } = params

  // Offset to paginate the results
  const offset = (page - 1) * per_page
  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  const [column, order] = (sort?.split(".").filter(Boolean) ?? [
    "createdAt",
    "desc",
  ]) as [keyof Task | undefined, "asc" | "desc" | undefined]

  // Filter tasks by date range
  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined
  try {
    const { data, total } = await db.$transaction(async db => {
      type Where = NonNullable<NonNullable<Parameters<typeof db.task.findMany>[0]>["where"]>
      const where: Where = {}
      if (!operator || operator === "and") {
        where.AND = [
          { title: { contains: title } },
          { priority: { in: priority?.split(".") as $Enums.Priority[] } },
          { status: { in: status?.split(".") as $Enums.Status[] } },
          { createdAt: { gte: fromDay, lte: toDay } },
        ]
      } else {
        where.OR = [
          { title: { contains: title } },
          { priority: { in: priority?.split(".") as $Enums.Priority[] } },
          { status: { in: status?.split(".") as $Enums.Status[] } },
          { createdAt: { gte: fromDay, lte: toDay } },
        ]
      }


      const data = await db.task.findMany({
        where,
        skip: offset,
        take: per_page,
        orderBy: column ? {
          [column]: order,
        } : {
          createdAt: "desc",
        },

      })
      const total = await db.task.count({ where })
      return { data, total }
    })
    revalidatePath('/products')
    return { data: { data, total }, error: null }
  } catch (error) {
    return { error: getErrorMessage(error), data: null }
  }
})

export const seedTasks = async (
  input: { count: number; reset?: boolean } = {
    count: 100,
    reset: false,
  }
) => {
  try {
    const allTasks: Task[] = []

    for (let i = 0; i < input.count; i++) {
      allTasks.push({
        id: generateUUID(),
        code: `TASK-${customAlphabet("0123456789", 4)()}`,
        title: faker.hacker
          .phrase()
          .replace(/^./, (letter) => letter.toUpperCase()),
        status:
          faker.helpers.shuffle<Task["status"]>(StatusSchema.options)[0] ??
          "todo",
        label:
          faker.helpers.shuffle<Task["label"]>(LabelSchema.options)[0] ??
          "bug",
        priority:
          faker.helpers.shuffle<Task["priority"]>(
            PrioritySchema.options
          )[0] ?? "low",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    input.reset && (await db.task.deleteMany({}))
    await db.task.createMany({ data: allTasks })
    console.log("📝 Inserting tasks", allTasks.length)
  } catch (error) {
    console.error("📝 Inserting tasks", error)
  }
}