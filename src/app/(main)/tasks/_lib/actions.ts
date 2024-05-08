"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm"
import { customAlphabet } from "nanoid"

import { getErrorMessage } from "@/lib/handle-error"

import { Task, task } from "@/drizzle/schema"
import { db } from "@/drizzle/db"
import { generateUUID } from "@/lib/utils"
import { CreateTaskSchema, UpdateTaskSchema } from "@/schema/data/task"

export async function seedTasks(
  input: { count: number; reset?: boolean } = {
    count: 100,
    reset: false,
  }
) {
  noStore()
  try {
    const allTasks: Task[] = []

    for (let i = 0; i < input.count; i++) {
      allTasks.push({
        id: generateUUID(),
        code: `TASK-${generateUUID().slice(0, 4)}`,
        title: faker.hacker
          .phrase()
          .replace(/^./, (letter) => letter.toUpperCase()),
        status:
          faker.helpers.shuffle<Task["status"]>(task.status.enumValues)[0] ??
          "todo",
        label:
          faker.helpers.shuffle<Task["label"]>(task.label.enumValues)[0] ??
          "bug",
        priority:
          faker.helpers.shuffle<Task["priority"]>(
            task.priority.enumValues
          )[0] ?? "low",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    input.reset && (await db.delete(task))

    console.log("📝 Inserting tasks", allTasks.length)

    await db.insert(task).values(allTasks)
  } catch (err) {
    console.error(err)
  }
}

export async function createTask(
  input: CreateTaskSchema & { anotherTaskId: string }
) {
  noStore()
  try {
    await Promise.all([
      db.insert(task).values({
        code: `TASK-${customAlphabet("0123456789", 4)()}`,
        title: input.title,
        status: input.status,
        label: input.label,
        priority: input.priority,
      }),
      // Delete another task to maintain the same number of tasks
      deleteTask({ id: input.anotherTaskId }),
    ])

    revalidatePath("/tasks")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateTask(input: UpdateTaskSchema) {
  noStore()
  try {
    await db
      .update(task)
      .set({
        label: input.label,
        status: input.status,
        priority: input.priority,
      })
      .where(eq(task.id, input.id))

    revalidatePath("/tasks")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteTask(input: { id: string }) {
  try {
    await db.delete(task).where(eq(task.id, input.id))

    // Create a new task for the deleted one
    await seedTasks({ count: 1 })

    revalidatePath("/tasks")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
