
import { MenuWithChildren, NewUser, Role, User as UserType } from '@/drizzle/schema'

export type UserCreate = NewUser

export interface User extends UserType {
  role: Role,
  createdBy: User,
  menus: MenuWithChildren[]
}