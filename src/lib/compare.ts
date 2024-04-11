import { compare } from "bcryptjs";

export const comparePassword = async (password: string, maybeUserPassword: string) => await compare(password, maybeUserPassword);