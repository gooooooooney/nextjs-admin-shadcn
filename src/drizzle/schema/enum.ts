import { pgEnum } from "drizzle-orm/pg-core"
import { z } from "zod"

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const status = pgEnum("Status", ['todo', 'inProgress', 'done', 'canceled'])
export const label = pgEnum("Label", ['bug', 'feature', 'enhancement', 'documentation'])
export const priority = pgEnum("Priority", ['low', 'medium', 'high'])
export const userRole = pgEnum("UserRole", ['user', 'admin', 'superAdmin'])
export const menuStatus = pgEnum("MenuStatus", ['active', 'inactive'])
export const userStatus = pgEnum("MenuStatus", ['active', 'inactive'])
export const menuType = pgEnum("MenuType", ['menu', 'button', 'dir'])
export const theme = pgEnum("Theme", ['light', 'dark', 'system'])

export const Theme = z.enum(theme.enumValues)
export type Theme = z.infer<typeof Theme>

export const UserRole = z.enum(userRole.enumValues)
export type UserRole = z.infer<typeof UserRole>


export const MenuType = z.enum(menuType.enumValues)
export type MenuType = z.infer<typeof MenuType>

export const MenuStatus = z.enum(menuStatus.enumValues)
export type MenuStatus = z.infer<typeof MenuStatus>

export const UserStatus = z.enum(userStatus.enumValues)
export type UserStatus = z.infer<typeof UserStatus>

export const Priority = z.enum(priority.enumValues)
export type Priority = z.infer<typeof Priority>

export const Label = z.enum(label.enumValues)
export type Label = z.infer<typeof Label>

export const Status = z.enum(status.enumValues)
export type Status = z.infer<typeof Status>

export const Action = z.enum(action.enumValues)
export type Action = z.infer<typeof Action>

export const EqualityOp = z.enum(equalityOp.enumValues)
export type EqualityOp = z.infer<typeof EqualityOp>

export const CodeChallengeMethod = z.enum(codeChallengeMethod.enumValues)
export type CodeChallengeMethod = z.infer<typeof CodeChallengeMethod>

export const AalLevel = z.enum(aalLevel.enumValues)
export type AalLevel = z.infer<typeof AalLevel>

export const FactorStatus = z.enum(factorStatus.enumValues)
export type FactorStatus = z.infer<typeof FactorStatus>

export const FactorType = z.enum(factorType.enumValues)
export type FactorType = z.infer<typeof FactorType>

export const KeyStatus = z.enum(keyStatus.enumValues)
export type KeyStatus = z.infer<typeof KeyStatus>

export const KeyType = z.enum(keyType.enumValues)
export type KeyType = z.infer<typeof KeyType>