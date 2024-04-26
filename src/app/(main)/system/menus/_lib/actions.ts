"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { getErrorMessage } from "@/lib/handle-error"

import { db } from "@/drizzle/db"
import type { CreateMenuSchema, UpdateMenuSchema } from "./validations"
import { menu } from "@/drizzle/schema"
import { currentUser } from "@/lib/auth"


// export async function seedTasks(
//   input: { count: number; reset?: boolean } = {
//     count: 100,
//     reset: false,
//   }
// ) {
//   noStore()
//   try {
//     const allTasks: Task[] = []

//     for (let i = 0; i < input.count; i++) {
//       allTasks.push({
//         id: generateUUID(),
//         code: `TASK-${customAlphabet("0123456789", 4)()}`,
//         title: faker.hacker
//           .phrase()
//           .replace(/^./, (letter) => letter.toUpperCase()),
//         status:
//           faker.helpers.shuffle<Task["status"]>(task.status.enumValues)[0] ??
//           "todo",
//         label:
//           faker.helpers.shuffle<Task["label"]>(task.label.enumValues)[0] ??
//           "bug",
//         priority:
//           faker.helpers.shuffle<Task["priority"]>(
//             task.priority.enumValues
//           )[0] ?? "low",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//     }

//     input.reset && (await db.delete(task))

//     console.log("📝 Inserting tasks", allTasks.length)

//     await db.insert(task).values(allTasks)
//   } catch (err) {
//     console.error(err)
//   }
// }

export async function createMenu(
  input: CreateMenuSchema
) {
  noStore()
  const userInfo = await currentUser()
  try {
    await db.insert(menu).values({
      ...input,
      createBy: userInfo!.id,
      updateBy: userInfo!.id,
      roleId: userInfo!.roleId,
      parentId: null,
    })

    revalidatePath("/system/menus")

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

export async function updateMenu(input: UpdateMenuSchema) {
  noStore()
  try {
    await db
      .update(menu)
      .set({
        label: input.label,
        status: input.status,
        path: input.path
      })
      .where(eq(menu.id, input.id))

    revalidatePath("/system/menus")

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

export async function deleteMenu(input: { id: string }) {
  try {
    await db.delete(menu).where(eq(menu.id, input.id))


    revalidatePath("/system/menus")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
