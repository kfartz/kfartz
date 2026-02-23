type TSquashed = Record<string, string | boolean | number | Array<unknown>>;

export function flattenObject<T extends object>(
  obj: T,
  ret: TSquashed = {},
  currKey = "",
): TSquashed {
  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, unknown>)[key];
    const newKey: string = !currKey ? key : `${currKey}.${key}`;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      flattenObject((obj as Record<string, object>)[key], ret, newKey);
    } else {
      (ret as TSquashed)[newKey] = (obj as TSquashed)[key];
    }
  }

  return ret;
}
