// ============================================================================
// DataForge Toolkit — Local Object Utilities
// Inlined from @mwakidenis/logx/object for self-contained builds
// ============================================================================

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!isObject(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function hasOwnProperty(obj: Record<PropertyKey, unknown>, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function clone<T>(value: T): T {
  if (isNil(value) || typeof value !== "object") {
    return value;
  }
  if (isArray(value)) {
    return value.slice() as unknown as T;
  }
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      result[key] = (value as Record<string, unknown>)[key];
    }
    return result as unknown as T;
  }
  return value;
}

export function deepClone<T>(value: T): T {
  const seen = new Map<unknown, unknown>();
  const walk = (item: unknown): unknown => {
    if (seen.has(item)) {
      return seen.get(item);
    }
    if (isNil(item) || typeof item !== "object") {
      return item;
    }
    if (isArray(item)) {
      const copy: unknown[] = [];
      seen.set(item, copy);
      for (let i = 0; i < item.length; i++) {
        copy[i] = walk(item[i]);
      }
      return copy;
    }
    if (isPlainObject(item)) {
      const copy: Record<string, unknown> = {};
      seen.set(item, copy);
      for (const key of Object.keys(item)) {
        copy[key] = walk((item as Record<string, unknown>)[key]);
      }
      return copy;
    }
    if (item instanceof Date) {
      return new Date(item.getTime());
    }
    if (item instanceof RegExp) {
      return new RegExp(item.source, item.flags);
    }
    if (typeof Map !== "undefined" && item instanceof Map) {
      const copy = new Map<unknown, unknown>();
      seen.set(item, copy);
      item.forEach((val, key) => {
        copy.set(walk(key), walk(val));
      });
      return copy;
    }
    if (typeof Set !== "undefined" && item instanceof Set) {
      const copy = new Set<unknown>();
      seen.set(item, copy);
      item.forEach((val) => {
        copy.add(walk(val));
      });
      return copy;
    }
    return item;
  };
  return walk(value) as T;
}

export function get<T extends Record<string, unknown>, P extends string>(
  object: T | null | undefined,
  path: P,
  defaultValue?: unknown,
): unknown {
  if (isNil(object)) {
    return defaultValue;
  }
  const parts = String(path).split(/[\.[\]]+/).filter(Boolean);
  let current: unknown = object;
  for (const part of parts) {
    if (!isObject(current) || !hasOwnProperty(current as Record<PropertyKey, unknown>, part as PropertyKey)) {
      return defaultValue;
    }
    current = (current as Record<string, unknown>)[part as string];
  }
  return current;
}

export function set<T extends Record<string, unknown>, P extends string>(
  object: T,
  path: P,
  value: unknown,
): T {
  if (!isObject(object)) {
    return object;
  }
  const parts = String(path).split(/[\.[\]]+/).filter(Boolean);
  let current: Record<string, unknown> = object as Record<string, unknown>;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i] as string;
    if (i === parts.length - 1) {
      current[part] = value;
    } else {
      if (!isObject(current[part])) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
  }
  return object;
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  keys: K[],
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of keys) {
    if (hasOwnProperty(object, key)) {
      result[key] = object[key];
    }
  }
  return result;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  keys: K[],
): Omit<T, K> {
  const result: Record<string, unknown> = { ...object };
  for (const key of keys) {
    delete result[key as string];
  }
  return result as Omit<T, K>;
}
