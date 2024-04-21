
import { pgTable, timestamp, text, integer, uniqueIndex, foreignKey, uuid } from "drizzle-orm/pg-core"
import { theme } from "./enum";
import { createInsertSchema } from 'drizzle-zod'
import { relations } from "drizzle-orm";
import { role } from "./role";


export const user = pgTable("User", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name"),
	email: text("email"),
	emailVerified: timestamp("emailVerified", { precision: 3, mode: 'string' }),
	password: text("password").notNull(),
	image: text("image"),
	theme: theme("theme").default('system'),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp("deletedAt", { precision: 3, mode: 'string' }),
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

export const account = pgTable("Account", {
	id: text("id").primaryKey().notNull(),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").on(table.provider, table.providerAccountId),
	}
});


export const session = pgTable("Session", {
	id: text("id").primaryKey().notNull(),
	sessionToken: text("sessionToken").notNull(),
	userId: uuid("userId").defaultRandom().notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		sessionTokenKey: uniqueIndex("Session_sessionToken_key").on(table.sessionToken),
	}
});

export const insertUserSchema = createInsertSchema(user, {
	email: s => s.email.email(),
});


export const userRelation = relations(user, ({one}) => ({
	role: one(role, {
		fields: [user.id],
		references: [role.userId],
	})
}))