export type ActionReturnValue<T> = {
  data: T,
  error: null,
} | {
  data: null
  error: string,
}

export type AuthResponse = { error?: string, success?: string, link?: string };

