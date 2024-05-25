import { pgTable, timestamp, varchar, uniqueIndex, foreignKey, boolean, uuid } from "drizzle-orm/pg-core"
import { menuStatus, menuType } from "./enum";
import { role } from "./role";
import { relations } from "drizzle-orm";
import { user } from "./user";


export const menuTable = pgTable("Menu", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  label: varchar("label").notNull(),
  path: varchar("path").notNull(),
  type: menuType("type").default('menu'),
  status: menuStatus("status").default('active'),
  icon: varchar("icon"),
  parentId: uuid("parentId"),
  createBy: uuid("createBy"),
  updateBy: uuid("updateBy"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
},
  (table) => {
    return {
      menuParentIdFkey: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
        name: "Menu_parentId_fkey"
      }).onUpdate("cascade").onDelete("cascade"),
    }
  });

export const menuRelations = relations(menuTable, ({ many, one }) => ({
  children: many(menuTable, {
    relationName: "menu_parent",
  }),
  createBy: one(menuTable, {
    fields: [menuTable.parentId],
    references: [menuTable.id],
    relationName: "menu_parent",
  }),
  users: many(userMenuTable, {
    relationName: 'user_menu_m',
  })
}))

export const userMenuTable = pgTable('user_menu', {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  menuId: uuid('menu_id').notNull().references(() => menuTable.id, { onDelete: 'cascade' }),
});

export const userMenuTableRelations = relations(userMenuTable, ({ many, one }) => ({
  user: one(user, {
    fields: [userMenuTable.userId],
    references: [user.id],
    relationName: 'user_menu_u',
  }),
  menu: one(menuTable, {
    fields: [userMenuTable.menuId],
    references: [menuTable.id],
    relationName: 'user_menu_m',
})}))


export type Menu = typeof menuTable.$inferSelect

export type MenuWithChildren = Menu & { children: MenuWithChildren[] }