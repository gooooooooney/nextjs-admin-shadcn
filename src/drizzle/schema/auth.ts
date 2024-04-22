import { pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core"




export const registerVerificationToken = pgTable("RegisterVerificationToken", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: varchar("email").notNull(),
	name: varchar("name").notNull(),
	adminId: uuid("adminId").notNull(),
	token: varchar("token").notNull().unique(),
	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		tokenKey: uniqueIndex("RegisterVerificationToken_token_key").on(table.token),
		emailTokenKey: uniqueIndex("RegisterVerificationToken_email_token_key").on(table.email, table.token),
	}
});

export const verificationToken = pgTable("VerificationToken", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: varchar("email").notNull(),
	token: varchar("token").notNull().unique(),
	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		tokenKey: uniqueIndex("VerificationToken_token_key").on(table.token),
		emailTokenKey: uniqueIndex("VerificationToken_email_token_key").on(table.email, table.token),
	}
});

export const newEmailVerificationToken = pgTable("NewEmailVerificationToken", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: varchar("email").notNull(),
	userId: uuid("userId").notNull(),
	token: varchar("token").notNull().unique(),
	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		tokenKey: uniqueIndex("NewEmailVerificationToken_token_key").on(table.token),
		emailTokenKey: uniqueIndex("NewEmailVerificationToken_email_token_key").on(table.email, table.token),
	}
});

export const passwordResetToken = pgTable("PasswordResetToken", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: varchar("email").notNull(),
	token: varchar("token").notNull().unique(),
	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		tokenKey: uniqueIndex("PasswordResetToken_token_key").on(table.token),
		emailTokenKey: uniqueIndex("PasswordResetToken_email_token_key").on(table.email, table.token),
	}
});
