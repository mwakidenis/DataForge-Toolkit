// ============================================================================
// DataForge Toolkit — Array Service
// Pure transformation logic leveraging @mwakidenis/logx
// ============================================================================

import { unique, chunk, groupBy } from "@mwakidenis/logx/array";
import { camelCase, snakeCase, kebabCase } from "@mwakidenis/logx/string";
import type { ArrayStats } from "./types";

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

export interface ParseArrayInput {
  input?: string;
  delimiter?: "," | "\n" | ";" | "|" | "\t";
  trimValues?: boolean;
  filterEmpty?: boolean;
}

export function parseArrayInput(input: string, opts: ParseArrayInput = {}): string[] {
  const { delimiter = ",", trimValues = true, filterEmpty = true } = opts;

  if (!input || !input.trim()) return [];

  const regex = delimiter === "\n" ? /\n+/ : new RegExp(`[${delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]+`);
  const parts = input.split(regex);

  const items = parts.map((item) => (trimValues ? item.trim() : item));

  if (filterEmpty) {
    return items.filter((item) => item.length > 0);
  }

  return items;
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------

export interface DedupResult {
  original: string[];
  unique: string[];
  removed: string[];
  stats: ArrayStats;
}

export function deduplicateArray(items: string[]): DedupResult {
  const original = [...items];
  const uniqueItems = unique(items);
  // Items removed are duplicates: items whose first occurrence index != current index
  const removed = items.filter((item, index) => items.indexOf(item) !== index);

  const stats: ArrayStats = {
    count: original.length,
    unique: uniqueItems.length,
    empty: original.filter((i) => i.length === 0).length,
  };

  return { original, unique: uniqueItems, removed, stats };
}

// ---------------------------------------------------------------------------
// Chunking
// ---------------------------------------------------------------------------

export interface ChunkResult {
  chunks: string[][];
  chunkSize: number;
  totalChunks: number;
  remainder: number;
}

export function chunkArray(items: string[], chunkSize: number): ChunkResult {
  const size = Math.max(1, Math.min(chunkSize, 100));
  const chunks = chunk(items, size);
  const totalChunks = chunks.length;
  const remainder = items.length % size;

  return { chunks, chunkSize: size, totalChunks, remainder };
}

// ---------------------------------------------------------------------------
// Grouping
// ---------------------------------------------------------------------------

export interface GroupResult {
  groups: Record<string, string[]>;
  entries: [string, string[]][];
  groupCount: number;
}

export function groupArrayByFirstLetter(items: string[]): GroupResult {
  const groups = groupBy(items, (value: string) => String(value).charAt(0).toUpperCase());
  const entries = Object.entries(groups);

  return { groups, entries, groupCount: entries.length };
}

// ---------------------------------------------------------------------------
// Case transformations
// ---------------------------------------------------------------------------

export interface CaseTransformResult {
  camelCase: string;
  snakeCase: string;
  kebabCase: string;
}

export function transformCase(input: string): CaseTransformResult {
  return {
    camelCase: camelCase(input),
    snakeCase: snakeCase(input),
    kebabCase: kebabCase(input),
  };
}

// ---------------------------------------------------------------------------
// Regex filtering
// ---------------------------------------------------------------------------

export interface RegexFilterResult {
  filtered: string[];
  matched: string[];
  matchCount: number;
  pattern: string;
}

export function filterArrayByRegex(items: string[], pattern: string): RegexFilterResult {
  let regex: RegExp;
  try {
    regex = new RegExp(pattern);
  } catch {
    regex = /.*/;
  }

  const matched = items.filter((item) => regex.test(item));
  const filtered = items.filter((item) => !regex.test(item));

  return { filtered, matched, matchCount: matched.length, pattern };
}

// ---------------------------------------------------------------------------
// Join
// ---------------------------------------------------------------------------

export function joinArray(items: string[], delimiter: string = ", "): string {
  return items.join(delimiter);
}

// ---------------------------------------------------------------------------
// Full pipeline result
// ---------------------------------------------------------------------------

export interface ArrayTransformResult {
  items: string[];
  parsedCount: number;
  dedup: DedupResult;
  chunk: ChunkResult;
  group: GroupResult;
  caseTransform: CaseTransformResult;
  stats: ArrayStats;
}

export function transformArray(input: string, opts: ParseArrayInput & { chunkSize: number; regexPattern?: string }): ArrayTransformResult & { regexFilter?: RegexFilterResult } {
  const items = parseArrayInput(input, opts);

  const dedup = deduplicateArray(items);
  const chunk = chunkArray(items, opts.chunkSize);
  const group = groupArrayByFirstLetter(items);
  const caseTransform = transformCase(input);
  const stats: ArrayStats = {
    count: items.length,
    unique: dedup.unique.length,
    empty: 0,
  };

  const result: ArrayTransformResult & { regexFilter?: RegexFilterResult } = {
    items,
    parsedCount: items.length,
    dedup,
    chunk,
    group,
    caseTransform,
    stats,
  };

  if (opts.regexPattern && opts.regexPattern.trim()) {
    result.regexFilter = filterArrayByRegex(items, opts.regexPattern);
  }

  return result;
}
