// ============================================================================
// DataForge Toolkit — Diff Service
// Deep structural comparison of two JSON objects
// ============================================================================

import type { DiffChange, ObjectDiffResult } from "./types";

// ---------------------------------------------------------------------------
// Deep diff
// ---------------------------------------------------------------------------

export function deepDiff(
  before: unknown,
  after: unknown,
  path: string = ""
): ObjectDiffResult {
  const added: Record<string, unknown> = {};
  const removed: Record<string, unknown> = {};
  const modified: Record<string, { before: unknown; after: unknown }> = {};
  const unchanged: Record<string, unknown> = {};
  const changes: DiffChange[] = [];

  const walk = (b: unknown, a: unknown, p: string): void => {
    const bIsObj = isPlainObject(b);
    const aIsObj = isPlainObject(a);

    // Both are objects - compare keys
    if (bIsObj && aIsObj) {
      const bKeys = Object.keys(b as Record<string, unknown>);
      const aKeys = Object.keys(a as Record<string, unknown>);
      const allKeys = new Set([...bKeys, ...aKeys]);

      allKeys.forEach((key) => {
        const keyPath = p ? `${p}.${key}` : key;
        const bVal = (b as Record<string, unknown>)[key];
        const aVal = (a as Record<string, unknown>)[key];

        if (!(key in (b as Record<string, unknown>))) {
          // Added
          added[key] = aVal;
          changes.push({ type: "added", path: keyPath, after: aVal });
        } else if (!(key in (a as Record<string, unknown>))) {
          // Removed
          removed[key] = bVal;
          changes.push({ type: "removed", path: keyPath, before: bVal });
        } else if (isPlainObject(bVal) && isPlainObject(aVal)) {
          // Both objects - recurse
          walk(bVal, aVal, keyPath);
          unchanged[key] = aVal;
          changes.push({ type: "unchanged", path: keyPath });
        } else if (JSON.stringify(bVal) === JSON.stringify(aVal)) {
          // Same value
          unchanged[key] = aVal;
          changes.push({ type: "unchanged", path: keyPath });
        } else {
          // Modified
          modified[key] = { before: bVal, after: aVal };
          changes.push({ type: "modified", path: keyPath, before: bVal, after: aVal });
        }
      });
    } else if (Array.isArray(b) && Array.isArray(a)) {
      // Both arrays - compare by index
      const maxLen = Math.max(b.length, a.length);
      for (let i = 0; i < maxLen; i++) {
        const keyPath = p ? `${p}[${i}]` : `[${i}]`;
        const bVal = b[i];
        const aVal = a[i];

        if (aVal === undefined) {
          removed[`[${i}]`] = bVal;
          changes.push({ type: "removed", path: keyPath, before: bVal });
        } else if (bVal === undefined) {
          added[`[${i}]`] = aVal;
          changes.push({ type: "added", path: keyPath, after: aVal });
        } else if (isPlainObject(bVal) && isPlainObject(aVal)) {
          walk(bVal, aVal, keyPath);
          unchanged[`[${i}]`] = aVal;
        } else if (JSON.stringify(bVal) === JSON.stringify(aVal)) {
          unchanged[`[${i}]`] = aVal;
          changes.push({ type: "unchanged", path: keyPath });
        } else {
          modified[`[${i}]`] = { before: bVal, after: aVal };
          changes.push({ type: "modified", path: keyPath, before: bVal, after: aVal });
        }
      }
    } else if (b !== a) {
      // Primitive values differ
      if (p) {
        modified[p] = { before: b, after: a };
        changes.push({ type: "modified", path: p, before: b, after: a });
      } else {
        // Root level change
        modified["root"] = { before: b, after: a };
        changes.push({ type: "modified", path: "root", before: b, after: a });
      }
    } else {
      // Same primitive
      if (p) {
        unchanged[p] = a;
        changes.push({ type: "unchanged", path: p });
      }
    }
  };

  walk(before, after, path);

  const total = Object.keys(added).length + Object.keys(removed).length + Object.keys(modified).length + Object.keys(unchanged).length;
  const similarityScore = total > 0 ? Object.keys(unchanged).length / total : 1;

  return { added, removed, modified, unchanged, changes, similarityScore };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// ---------------------------------------------------------------------------
// Format diff for display
// ---------------------------------------------------------------------------

export function formatDiffForDisplay(result: ObjectDiffResult): {
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  unchangedCount: number;
  summary: string;
} {
  return {
    addedCount: Object.keys(result.added).length,
    removedCount: Object.keys(result.removed).length,
    modifiedCount: Object.keys(result.modified).length,
    unchangedCount: Object.keys(result.unchanged).length,
    summary: `${Object.keys(result.modified).length} modified, ${Object.keys(result.added).length} added, ${Object.keys(result.removed).length} removed`,
  };
}
