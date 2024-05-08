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



export type Role = typeof role.$inferSelect