type PathImpl<T, K extends keyof T> = K extends string
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T[K] extends Record<string, any>
    ? `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never

export type Path<T> = PathImpl<T, keyof T>

export type I18nValue<
  T,
  P extends Path<T>
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? I18nValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never
