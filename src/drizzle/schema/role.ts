import { pgTable,timestamp, varchar, uniqueIndex, foreignKey, boolean, uuid } from "drizzle-orm/pg-core"
import { user } from "./user";
import { userRole, menuType, menuStatus } from "./enum";
import { relations } from "drizzle-orm";



export const role = pgTable("Role", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name").default('user'),
	userRole: userRole("userRole").default('user'),
	superAdmin: boolean("superAdmin").default(false),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp("createdAt").defaultNow(),
	updatedAt: timestamp("updatedAt"),
},
(table) => {
	return {
		userIdKey: uniqueIndex("Role_userId_key").on(table.userId),
	}
});

export const menu = pgTable("Menu", {
	id: uuid("id").defaultRandom().primaryKey(),
	label: varchar("label").notNull(),
	path: varchar("path").notNull(),
	roleId: varchar("roleId").notNull().references(() => role.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	type: menuType("type").default('menu').notNull(),
	status: menuStatus("status").default('active').notNull(),
	icon: varchar("icon"),
	parentId: uuid("parentId"),
	createBy: uuid("createBy").notNull(),
	updateBy: uuid("updateBy").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
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
