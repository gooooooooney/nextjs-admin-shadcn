import { pgTable, timestamp, varchar, uniqueIndex, foreignKey, boolean, uuid } from "drizzle-orm/pg-core"
import { user } from "./user";
import { userRole, menuType, menuStatus } from "./enum";
import { relations } from "drizzle-orm";



export const role = pgTable("Role", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: varchar("name").default('user'),
	userRole: userRole("userRole").default('user'),
	superAdmin: boolean("superAdmin").default(false),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
	createdAt: timestamp("createdAt").defaultNow(),
	updatedAt: timestamp("updatedAt"),
},
	(table) => {
		return {
			userIdKey: uniqueIndex("Role_userId_key").on(table.userId),
		}
	});

export const menu = pgTable("Menu", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	label: varchar("label").notNull(),
	path: varchar("path").notNull(),
	roleId: uuid("roleId").notNull().references(() => role.id, { onDelete: "cascade", onUpdate: "cascade" }),
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

export const menuRelations = relations(menu, ({ many, one }) => ({
	children: many(menu),
	role: one(role, {
		fields: [menu.roleId],
		references: [role.id]
	})
}))

export const roleRelations = relations(role, ({ many }) => ({
	menus: many(menu)
}))

export type Menu = typeof menu.$inferSelect

export type MenuWithChildren = Menu & { children: MenuWithChildren[] }

export type Role = typeof role.$inferSelect