"use server"

import { utapi } from "@/server/uploadthing"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { updateProfile } from "./user"

const uploadthingDeleteFilesSchema = z.string()

export const deleteUploadthingFiles = async (params: z.infer<typeof uploadthingDeleteFilesSchema>) => {
  const result = uploadthingDeleteFilesSchema.safeParse(params)
  if (!result.success) {
    return {
      error: "Invalid params"
    }
  }
 
  const res = await utapi.deleteFiles(result.data)
  if (res.success) {
    updateProfile({ image: "" })
  }
  revalidatePath("/", "layout")
  revalidatePath("/settings/profile", "page")
  return res
}