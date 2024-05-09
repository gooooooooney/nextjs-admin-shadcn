import { Menu } from "@/drizzle/schema";

export type MenuWithValue = Omit<Menu, 'icon'> & { value: string }