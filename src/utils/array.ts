// ============================================================================
// DataForge Toolkit — Local Array Utilities
// Inlined from @mwakidenis/logx/array for self-contained builds
// ============================================================================

export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function chunk<T>(array: T[], size: number): T[][] {
  if (!isArray(array)) {
    throw new TypeError("chunk expects an array as the first argument");
  }
  if (!isNumber(size) || size < 1 || !Number.isInteger(size)) {
    throw new TypeError("chunk expects size to be a positive integer");
  }
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function unique<T>(array: T[]): T[] {
  if (!isArray(array)) {
    throw new TypeError("unique expects an array");
  }
  return Array.from(new Set(array));
}

export function groupBy<T>(
  array: T[],
  key: string | ((value: T, index: number) => string),
): Record<string, T[]> {
  if (!isArray(array)) {
    throw new TypeError("groupBy expects an array");
  }
  const result: Record<string, T[]> = {};
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    const groupKey =
      typeof key === "function" ? key(value, i) : String((value as Record<string, unknown>)[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(value);
  }
  return result;
}
