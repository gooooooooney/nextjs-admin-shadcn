import { pgTable, pgEnum, timestamp, text, integer, uniqueIndex, uuid } from "drizzle-orm/pg-core"




export const registerVerificationToken = pgTable("RegisterVerificationToken", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: text("email").notNull(),
	name: text("name").notNull(),
	adminId: uuid("adminId").notNull(),
	token: text("token").notNull(),
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
	email: text("email").notNull(),
	token: text("token").notNull(),
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
	email: text("email").notNull(),
	userId: uuid("userId").notNull(),
	token: text("token").notNull(),
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
	email: text("email").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
},
(table) => {
	return {
		tokenKey: uniqueIndex("PasswordResetToken_token_key").on(table.token),
		emailTokenKey: uniqueIndex("PasswordResetToken_email_token_key").on(table.email, table.token),
	}
});
