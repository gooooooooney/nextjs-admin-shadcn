import { z } from "zod";
import { TaskSchema } from "../zod/models";

export const UpdateTaskSchema = TaskSchema.pick({
  id: true,
  label: true,
  priority: true,
  status: true,
}).partial({
  label: true,
  status: true,
  priority: true,
})


export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: TaskSchema.shape.status.optional(),
  priority: TaskSchema.shape.priority.optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getTasksSchema = searchParamsSchema

export type UpdateTask = z.infer<typeof UpdateTaskSchema>