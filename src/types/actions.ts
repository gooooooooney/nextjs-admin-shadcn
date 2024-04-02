export type ActionReturnValue<T> = {
  data: T,
  error: null,
} | {
  data: null
  error: string,
}