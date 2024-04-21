import { pgTable,timestamp, text, uniqueIndex, foreignKey, boolean, uuid } from "drizzle-orm/pg-core"
import { user } from "./user";
import { userRole, menuType, menuStatus } from "./enum";



export const role = pgTable("Role", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").default('user').notNull(),
	userRole: userRole("userRole").default('user').notNull(),
	superAdmin: boolean("superAdmin").default(false),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		userIdKey: uniqueIndex("Role_userId_key").on(table.userId),
	}
});

export const menu = pgTable("Menu", {
	id: uuid("id").defaultRandom().primaryKey(),
	label: text("label").notNull(),
	path: text("path").notNull(),
	roleId: text("roleId").notNull().references(() => role.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	type: menuType("type").default('menu').notNull(),
	status: menuStatus("status").default('active').notNull(),
	icon: text("icon"),
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