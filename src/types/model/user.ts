
import { NewUser, Role, User as UserType } from '@/drizzle/schema'

export type UserCreate = NewUser

export interface User extends UserType {
  role: Role
}