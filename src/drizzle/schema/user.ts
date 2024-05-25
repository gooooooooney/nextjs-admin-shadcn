
import { pgTable, timestamp, varchar, integer, uniqueIndex, foreignKey, uuid } from "drizzle-orm/pg-core"
import { theme, userStatus } from "./enum";
import { relations } from "drizzle-orm";
import { createInsertSchema } from 'drizzle-zod'
import { role } from "./role";
import { userMenuTable } from "./menu";


export const user = pgTable("User", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: varchar("name"),
	email: varchar("email"),
	emailVerified: timestamp("emailVerified"),
	password: varchar("password").notNull(),
	image: varchar("image"),
	theme: theme("theme").default('system'),
	status: userStatus("status").default('active'),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt"),
	deletedAt: timestamp("deletedAt"),
	deletedById: uuid("deletedById"),
	createdById: uuid("createdById"),
},
	(table) => {
		return {
			emailKey: uniqueIndex("User_email_key").on(table.email),
			userCreatedByIdFkey: foreignKey({
				columns: [table.createdById],
				foreignColumns: [table.id],
				name: "User_createdById_fkey"
			}).onUpdate("cascade").onDelete("set null"),
			userDeletedByIdFkey: foreignKey({
				columns: [table.deletedById],
				foreignColumns: [table.id],
				name: "User_deletedById_fkey"
			}).onUpdate("cascade").onDelete("set null"),
		}
	});

export const UserSchema = createInsertSchema(user)

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

export const account = pgTable("Account", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
	type: varchar("type").notNull(),
	provider: varchar("provider").notNull(),
	providerAccountId: varchar("providerAccountId").notNull(),
	refreshToken: varchar("refresh_token"),
	accessToken: varchar("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: varchar("token_type"),
	scope: varchar("scope"),
	idToken: varchar("id_token"),
	sessionState: varchar("session_state"),
},
	(table) => {
		return {
			providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").on(table.provider, table.providerAccountId),
		}
	});


export const session = pgTable("Session", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	sessionToken: varchar("sessionToken").notNull(),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
	expires: timestamp("expires").notNull(),
},
	(table) => {
		return {
			sessionTokenKey: uniqueIndex("Session_sessionToken_key").on(table.sessionToken),
		}
	});


export const userRelation = relations(user, ({ one, many }) => ({
	role: one(role, {
		fields: [user.id],
		references: [role.userId],
	}),
	createdBy: one(user, {
		fields: [user.createdById],
		references: [user.id],
		relationName: 'user_createdBy',
	}),
	deletedBy: one(user, {
		fields: [user.deletedById],
		references: [user.id],
		relationName: 'user_deletedBy',
	}),
	accounts: many(account, {
		relationName: 'user_accounts',
	}),
	session: many(session, {
		relationName: 'user_sessions',
	}),
	createdUsers: many(user, {
		relationName: 'user_createdBy',
	}),
	menus: many(userMenuTable, {
		relationName: 'user_menu_u',

	}),

}))

export const accountRelation = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
		relationName: 'user_accounts'
	}),
}))

export const sessionRelation = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
		relationName: 'user_sessions'
	}),
}))
