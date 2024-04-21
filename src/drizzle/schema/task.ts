import { pgTable, timestamp, text, integer, uniqueIndex, foreignKey, boolean, uuid } from "drizzle-orm/pg-core"
import { label, priority, status } from "./enum";


export const task = pgTable("Task", {
	id: uuid("id").defaultRandom().primaryKey(),
	code: text("code").notNull(),
	title: text("title").notNull(),
	status: status("status").default('todo').notNull(),
	label: label("label").default('bug').notNull(),
	priority: priority("priority").default('low').notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		codeKey: uniqueIndex("Task_code_key").on(table.code),
	}
});