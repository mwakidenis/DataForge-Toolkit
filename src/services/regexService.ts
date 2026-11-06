// ============================================================================
// DataForge Toolkit — Regex Service
// Live regex matching, capture groups, and replacement
// ============================================================================

import type { RegexMatchResult, RegexReplaceResult } from "./types";

export type { RegexMatchResult, RegexReplaceResult };

// ---------------------------------------------------------------------------
// Regex matching
// ---------------------------------------------------------------------------

export function testRegex(input: string, pattern: string, flags: string = ""): RegexMatchResult {
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    regex = /.*/;
  }

  const matches = input.match(regex);
  const hasMatch = matches !== null;
  const matchCount = matches ? matches.length : 0;

  // Extract capture groups (exclude the full match at index 0)
  const captureGroups: string[][] = [];
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      const groupMatches: string[] = [];
      // RegExpMatchArray doesn't expose groups directly in TS, but we know the structure
      if (matches[i] !== undefined) {
        groupMatches.push(matches[i]);
      }
      captureGroups.push(groupMatches);
    }
  }

  // Find first match index
  let index = -1;
  if (hasMatch && matches && matches.index !== undefined) {
    index = matches.index;
  }

  return {
    matches,
    matchCount,
    captureGroups,
    hasMatch,
    index,
    input,
    pattern,
    flags,
  };
}

// ---------------------------------------------------------------------------
// Find all matches (global flag)
// ---------------------------------------------------------------------------

export function findAllMatches(input: string, pattern: string, flags: string = "g"): {
  matches: RegExpExecArray[];
  matchCount: number;
  pattern: string;
  flags: string;
} {
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    regex = /.*/g;
  }

  const results: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;

  // Reset lastIndex for global regex
  regex.lastIndex = 0;

  while ((match = regex.exec(input)) !== null) {
    results.push(match);
    if (!regex.global) break;
  }

  return { matches: results, matchCount: results.length, pattern, flags };
}

// ---------------------------------------------------------------------------
// Regex replacement
// ---------------------------------------------------------------------------

export function replaceRegex(
  input: string,
  pattern: string,
  replacement: string,
  flags: string = ""
): RegexReplaceResult {
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch {
    regex = /./;
  }

  const result = input.replace(regex, replacement);

  // Count replacements
  let replacements = 0;
  try {
    const countRegex = new RegExp(pattern, (flags.includes("g") ? flags : flags + "g"));
    const matches = input.match(countRegex);
    replacements = matches ? matches.length : 0;
  } catch {
    replacements = 0;
  }

  return { result, replacements, pattern, replacement, flags };
}

// ---------------------------------------------------------------------------
// Validate regex pattern
// ---------------------------------------------------------------------------

export function validateRegex(pattern: string, flags: string = ""): { valid: boolean; error?: string } {
  try {
    new RegExp(pattern, flags);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : "Invalid regex pattern" };
  }
}
