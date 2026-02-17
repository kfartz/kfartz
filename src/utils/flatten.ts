type Primitive = string | number | boolean | bigint | symbol | null | undefined;

// biome-ignore lint: suspicious/noExplicitAny
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type FlattenedObject<T> = UnionToIntersection<Flatten<T>>;

type Flatten<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Primitive | readonly unknown[]
    ? { [P in `${Prefix}${K}`]: T[K] }
    : T[K] extends Record<string, unknown>
      ? Flatten<T[K], `${Prefix}${K}.`>
      : { [P in `${Prefix}${K}`]: T[K] };
}[keyof T & string];

export function flattenObject<T extends object>(
  obj: T,
  ret: Partial<FlattenedObject<T>> = {},
  currKey = "",
): FlattenedObject<T> {
  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, unknown>)[key];
    const newKey: string = !currKey ? key : `${currKey}.${key}`;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      flattenObject((obj as Record<string, object>)[key], ret, newKey);
    } else {
      (ret as Record<string, object>)[newKey] = (obj as Record<string, object>)[
        key
      ];
    }
  }

  return ret as FlattenedObject<T>;
}
