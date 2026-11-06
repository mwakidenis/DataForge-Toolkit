// ============================================================================
// DataForge Toolkit — Shared Service Types
// ============================================================================

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export type JsonPrimitive = string | number | boolean | null;

export interface ServiceResult<T> {
  ok: true;
  data: T;
}

export interface ServiceError {
  ok: false;
  error: string;
  code: string;
}

export type ServiceResponse<T> = ServiceResult<T> | ServiceError;

export const isServiceError = <T>(result: ServiceResponse<T>): result is ServiceError => !result.ok;

export const isServiceResult = <T>(result: ServiceResponse<T>): result is ServiceResult<T> => result.ok;

export interface ParseLocation {
  line: number;
  column: number;
}

export interface JsonParseError extends Error {
  location?: ParseLocation;
}

export interface ArrayStats {
  count: number;
  unique: number;
  empty: number;
}

export interface FrequencyEntry {
  value: string | number;
  count: number;
  percentage: number;
}

export interface StatsResult {
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
  min: number;
  max: number;
  count: number;
  range: number;
  iqr: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  frequency: FrequencyEntry[];
}

export interface ObjectDiffResult {
  added: Record<string, unknown>;
  removed: Record<string, unknown>;
  modified: Record<string, { before: unknown; after: unknown }>;
  unchanged: Record<string, unknown>;
}

export interface CsvParseOptions {
  delimiter: "," | ";" | "\t" | "|";
  hasHeader: boolean;
  trimValues: boolean;
}

export interface RegexMatchResult {
  matches: RegExpMatchArray | null;
  matchCount: number;
  captureGroups: string[][];
  hasMatch: boolean;
  index: number;
  input: string;
  pattern: string;
  flags: string;
}

export interface RegexReplaceResult {
  result: string;
  replacements: number;
  pattern: string;
  replacement: string;
  flags: string;
}

export interface CsvRow {
  [key: string]: string;
}

export interface CsvParseResult {
  headers: string[];
  rows: CsvRow[];
  rowCount: number;
  delimiter: string;
  hasHeader: boolean;
}

export interface CsvStringifyResult {
  csv: string;
  headers: string[];
  rowCount: number;
}

export interface DiffChange {
  type: "added" | "removed" | "modified" | "unchanged";
  path: string;
  before?: unknown;
  after?: unknown;
}

export interface ObjectDiffResult {
  added: Record<string, unknown>;
  removed: Record<string, unknown>;
  modified: Record<string, { before: unknown; after: unknown }>;
  unchanged: Record<string, unknown>;
  changes: DiffChange[];
  similarityScore: number;
}
