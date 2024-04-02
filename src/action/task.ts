"use server"

import { getErrorMessage } from "@/lib/handle-error"
import { action } from "@/lib/safe-action"
import { type UpdateTask, UpdateTaskSchema } from "@/schema/data/task"
import { TaskCreateSchema, TaskSchema } from "@/schema/zod/models"
import { db } from "@/server/db"
import { type ActionReturnValue } from "@/types/actions"
import { type Task, type TaskCreate } from "@/types/model/task"
import { revalidatePath } from "next/cache"


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
    revalidatePath('/product')
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
    revalidatePath('/product')
    return { data, error: null }
  } catch (error) {
    return { error: getErrorMessage(error), data: null }
  }
})