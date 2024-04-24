import { pgTable, timestamp, text, integer, uniqueIndex, foreignKey, boolean, uuid, varchar } from "drizzle-orm/pg-core"
import { label, priority, status } from "./enum";
import { sql } from "drizzle-orm";


export const task = pgTable("Task", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	code: varchar("code").notNull(),
	title: varchar("title").notNull(),
	status: status("status").default('todo').notNull().default('todo'),
	label: label("label").default('bug').notNull().default('bug'),
	priority: priority("priority").default('low').notNull().default('low'),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").default(sql`current_timestamp`),
},
	(table) => {
		return {
			codeKey: uniqueIndex("Task_code_key").on(table.code),
		}
	});

export type Task = typeof task.$inferSelect
export type NewTask = typeof task.$inferInsert