// ============================================================================
// DataForge Toolkit — JSON Service
// Pure transformation logic leveraging @mwakidenis/logx/object
// ============================================================================

import { get, set, deepClone, pick, omit } from "../utils/object";
import type {
  JsonObject,
  JsonValue,
  ServiceResponse,
  ServiceError,
  JsonParseError,
} from "./types";

export type { JsonObject };

// ---------------------------------------------------------------------------
// Parsing with location info
// ---------------------------------------------------------------------------

export function safeParseJson(input: string): ServiceResponse<JsonValue> {
  if (!input || !input.trim()) {
    return { ok: false, error: "Input is empty", code: "EMPTY_INPUT" };
  }

  try {
    return { ok: true, data: JSON.parse(input) as JsonValue };
  } catch (e) {
    const err = e as JsonParseError;
    return {
      ok: false,
      error: err.message || "Invalid JSON",
      code: "INVALID_JSON",
    } as ServiceError;
  }
}

// ---------------------------------------------------------------------------
// Deep get
// ---------------------------------------------------------------------------

export function deepGet(obj: unknown, path: string): ServiceResponse<JsonValue> {
  try {
    const value = get(obj as Record<string, unknown>, path);
    if (value === undefined) {
      return { ok: false, error: `Path "${path}" not found`, code: "PATH_NOT_FOUND" };
    }
    return { ok: true, data: value as JsonValue };
  } catch {
    return { ok: false, error: `Invalid path "${path}"`, code: "INVALID_PATH" };
  }
}

// ---------------------------------------------------------------------------
// Deep set
// ---------------------------------------------------------------------------

export function deepSet(obj: JsonObject, path: string, value: JsonValue): ServiceResponse<JsonObject> {
  try {
    const cloned = deepClone(obj);
    const next = set(cloned as Record<string, unknown>, path, value);
    return { ok: true, data: next as JsonObject };
  } catch (e) {
    return { ok: false, error: `Failed to set value at path "${path}": ${e instanceof Error ? e.message : String(e)}`, code: "SET_FAILED" };
  }
}

// ---------------------------------------------------------------------------
// Deep clone
// ---------------------------------------------------------------------------

export function deepCloneJson(obj: unknown): JsonValue {
  return deepClone(obj) as JsonValue;
}

// ---------------------------------------------------------------------------
// Pick / Omit
// ---------------------------------------------------------------------------

export interface PickOmitResult {
  picked: Record<string, unknown>;
  omitted: Record<string, unknown>;
  pickKeys: string[];
  omitKeys: string[];
}

export function pickOmitKeys(obj: JsonObject, pickKeys: string[], omitKeys: string[]): ServiceResponse<PickOmitResult> {
  try {
    const pickArray = pickKeys.filter(Boolean);
    const omitArray = omitKeys.filter(Boolean);

    const picked = pick(obj, pickArray as unknown as (keyof JsonObject)[]) as Record<string, unknown>;
    const omitted = omit(obj, omitArray as unknown as (keyof JsonObject)[]) as Record<string, unknown>;

    return { ok: true, data: { picked, omitted, pickKeys: pickArray, omitKeys: omitArray } };
  } catch (e) {
    return { ok: false, error: `Pick/omit failed: ${e instanceof Error ? e.message : String(e)}`, code: "PICK_OMIT_FAILED" };
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function validateJsonStructure(obj: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (obj === null || obj === undefined) {
    errors.push("Value is null or undefined");
    return { valid: false, errors };
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      errors.push("Array is empty");
    }
    obj.forEach((item, i) => {
      if (typeof item !== "object" || item === null) {
        errors.push(`Index ${i} is not an object`);
      }
    });
    return { valid: errors.length === 0, errors };
  }

  if (typeof obj === "object") {
    const keys = Object.keys(obj as JsonObject);
    if (keys.length === 0) {
      errors.push("Object is empty");
    }
    return { valid: errors.length === 0, errors };
  }

  errors.push("Value is not a JSON object or array");
  return { valid: false, errors };
}

// ---------------------------------------------------------------------------
// Path query
// ---------------------------------------------------------------------------

export function queryPath(obj: unknown, path: string): ServiceResponse<JsonValue> {
  try {
    const value = get(obj as Record<string, unknown>, path);
    if (value === undefined) {
      return { ok: false, error: `Path "${path}" not found`, code: "PATH_NOT_FOUND" };
    }
    return { ok: true, data: value as JsonValue };
  } catch {
    return { ok: false, error: `Invalid path "${path}"`, code: "INVALID_PATH" };
  }
}
