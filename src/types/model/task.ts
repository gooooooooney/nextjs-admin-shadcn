import { type TaskSchema, type TaskCreateSchema } from "@/schema/zod/models";
import { type z } from "zod";

export type TaskCreate = z.infer<typeof TaskCreateSchema>

export type Task = z.infer<typeof TaskSchema>