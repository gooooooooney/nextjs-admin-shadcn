import { z } from "zod";
import { TaskSchema } from "../zod/models";
import { task } from "@/drizzle/schema";


export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status:z.string().optional(),
  priority: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getTasksSchema = searchParamsSchema

export type GetTasksSchema = z.infer<typeof getTasksSchema>


export const createTaskSchema = z.object({
  title: z.string(),
  label: z.enum(task.label.enumValues),
  status: z.enum(task.status.enumValues),
  priority: z.enum(task.priority.enumValues),
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
  id: z.string(),
  label: z.enum(task.label.enumValues).optional(),
  status: z.enum(task.status.enumValues).optional(),
  priority: z.enum(task.priority.enumValues).optional(),
})

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>