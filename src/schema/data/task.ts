import { type z } from "zod";
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

export type UpdateTask = z.infer<typeof UpdateTaskSchema>