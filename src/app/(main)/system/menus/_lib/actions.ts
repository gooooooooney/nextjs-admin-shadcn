"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq, inArray } from "drizzle-orm"

import { getErrorMessage } from "@/lib/handle-error"

import { db } from "@/drizzle/db"
import type { CreateMenuSchema, UpdateMenuSchema } from "./validations"
import { menuTable } from "@/drizzle/schema"
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
  input: CreateMenuSchema,
  parentId: string | null
) {
  noStore()
  const userInfo = await currentUser()
  try {
    await db.insert(menuTable).values({
      ...input,
      createBy: userInfo!.id,
      updateBy: userInfo!.id,
      parentId,
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


export async function updateMenu(input: UpdateMenuSchema, id: string) {
  noStore()
  try {
    await db
      .update(menuTable)
      .set({
        ...input,
      })
      .where(eq(menuTable.id, id)).returning()

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

export async function deleteMenusAction(input: { ids: string[] }) {
  try {
    const userInfo = await currentUser()
    // for now only super admin can delete menu
    if (!userInfo?.superAdmin) {
      return {
        data: null,
        message: "You are not authorized to delete this menu",
      }
    }
    await db.delete(menuTable).where(inArray(menuTable.id, input.ids))


    revalidatePath("/system/menus")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
