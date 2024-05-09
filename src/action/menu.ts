"use server"

import { action } from "@/lib/safe-action"
import { assignMenusToUser, getMenusByUserId } from "@/server/data/menu"
import { MenuWithValue } from "@/types/model/menu"
import { assignMenusToUserSchema, getMenusByUserIdSchema } from '@/schema/data/menus'

export async function getUserMenus(userId: string): Promise<MenuWithValue[]> {
  const data = await getMenusByUserId(userId)
  if (!data) {
    return []
  }

  return data.map(menu => {
    const { icon, ...rest } = menu
    return { ...rest, value: menu.id }
  })
}

export const getMenusByUserIdAction = action<typeof getMenusByUserIdSchema, MenuWithValue[]>(getMenusByUserIdSchema, async ({userId}) => {
  const data = await getMenusByUserId(userId)
  if (!data) {
    return []
  }

  return data.map(menu => {
    const { icon, ...rest } = menu
    return { ...rest, value: menu.id }
  })
})

export const assignMenusToUserAction = action(assignMenusToUserSchema, async ({userId, menuIds}) => {
  const data = await assignMenusToUser(userId, menuIds)
  if (data.length) {
    return {
      success: true,
      message: "Menus assigned successfully",
    }
  }
  return {
    success: false,
    message: "Failed to assign menus",
  }
})

