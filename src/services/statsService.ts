// ============================================================================
// DataForge Toolkit — Stats Service
// Pure statistical computations leveraging @mwakidenis/logx/math
// ============================================================================

import {
  sum,
  mean,
  median,
  mode,
  variance,
  standardDeviation,
  min,
  max,
} from "@mwakidenis/logx/math";
import type { StatsResult, FrequencyEntry } from "./types";

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

export interface ParseNumbersInput {
  input?: string;
  delimiter?: "," | "\n" | ";" | " " | "\t";
}

export function parseNumbers(input: string, opts: ParseNumbersInput = {}): number[] {
  const { delimiter = "," } = opts;

  if (!input || !input.trim()) return [];

  const regex = delimiter === "\n" ? /\n+/ : new RegExp(`[${delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]+`);
  const parts = input.split(regex);

  return parts
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => !Number.isNaN(n));
}

// ---------------------------------------------------------------------------
// Percentile computation (nearest-rank method)
// ---------------------------------------------------------------------------

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];

  const rank = Math.ceil((p / 100) * sorted.length);
  const index = Math.max(0, Math.min(rank - 1, sorted.length - 1));
  return sorted[index];
}

// ---------------------------------------------------------------------------
// IQR
// ---------------------------------------------------------------------------

function computeIQR(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const p25 = percentile(sorted, 25);
  const p75 = percentile(sorted, 75);
  return p75 - p25;
}

// ---------------------------------------------------------------------------
// Frequency distribution
// ---------------------------------------------------------------------------

function computeFrequency(numbers: number[]): FrequencyEntry[] {
  if (numbers.length === 0) return [];

  const freqMap = new Map<number, number>();
  for (const n of numbers) {
    freqMap.set(n, (freqMap.get(n) || 0) + 1);
  }

  return Array.from(freqMap.entries())
    .map(([value, count]) => ({
      value,
      count,
      percentage: ((count / numbers.length) * 100),
    }))
    .sort((a, b) => b.count - a.count || a.value - b.value);
}

// ---------------------------------------------------------------------------
// Full stats computation
// ---------------------------------------------------------------------------

export function computeStats(numbers: number[]): StatsResult {
  if (numbers.length === 0) {
    return {
      sum: 0,
      mean: 0,
      median: 0,
      mode: [],
      variance: 0,
      stdDev: 0,
      min: 0,
      max: 0,
      count: 0,
      range: 0,
      iqr: 0,
      p25: 0,
      p50: 0,
      p75: 0,
      p90: 0,
      p95: 0,
      frequency: [],
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const count = numbers.length;

  const total = sum(numbers);
  const avg = mean(numbers);
  const med = median(numbers);
  const mods = mode(numbers);
  const vari = variance(numbers);
  const std = standardDeviation(numbers);
  const mn = min(numbers);
  const mx = max(numbers);

  return {
    sum: total,
    mean: avg,
    median: med,
    mode: mods,
    variance: vari,
    stdDev: std,
    min: mn,
    max: mx,
    count,
    range: mx - mn,
    iqr: computeIQR(sorted),
    p25: percentile(sorted, 25),
    p50: percentile(sorted, 50),
    p75: percentile(sorted, 75),
    p90: percentile(sorted, 90),
    p95: percentile(sorted, 95),
    frequency: computeFrequency(numbers),
  };
}

// ---------------------------------------------------------------------------
// Transform pipeline
// ---------------------------------------------------------------------------

export interface StatsTransformResult {
  numbers: number[];
  parsedCount: number;
  stats: StatsResult;
  sorted: number[];
}

export function transformStats(input: string, opts: ParseNumbersInput = {}): StatsTransformResult {
  const numbers = parseNumbers(input, opts);
  const stats = computeStats(numbers);
  const sorted = [...numbers].sort((a, b) => a - b);

  return { numbers, parsedCount: numbers.length, stats, sorted };
}

// ---------------------------------------------------------------------------
// Summary report (downloadable content)
// ---------------------------------------------------------------------------

export function generateSummaryReport(stats: StatsResult, input: string): string {
  const lines: string[] = [];
  lines.push("DataForge Toolkit — Statistical Summary Report");
  lines.push("=".repeat(50));
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Input: ${input.slice(0, 100)}${input.length > 100 ? "…" : ""}`);
  lines.push("");
  lines.push("Core Statistics:");
  lines.push(`  Count:       ${stats.count}`);
  lines.push(`  Sum:         ${stats.sum.toFixed(4)}`);
  lines.push(`  Mean:        ${stats.mean.toFixed(4)}`);
  lines.push(`  Median:      ${stats.median.toFixed(4)}`);
  lines.push(`  Mode:        ${stats.mode.join(", ") || "—"}`);
  lines.push(`  Variance:    ${stats.variance.toFixed(6)}`);
  lines.push(`  Std. Dev.:   ${stats.stdDev.toFixed(6)}`);
  lines.push(`  Min:         ${stats.min.toFixed(4)}`);
  lines.push(`  Max:         ${stats.max.toFixed(4)}`);
  lines.push(`  Range:       ${stats.range.toFixed(4)}`);
  lines.push(`  IQR:         ${stats.iqr.toFixed(6)}`);
  lines.push("");
  lines.push("Percentiles:");
  lines.push(`  P25:         ${stats.p25.toFixed(4)}`);
  lines.push(`  P50:         ${stats.p50.toFixed(4)}`);
  lines.push(`  P75:         ${stats.p75.toFixed(4)}`);
  lines.push(`  P90:         ${stats.p90.toFixed(4)}`);
  lines.push(`  P95:         ${stats.p95.toFixed(6)}`);
  lines.push("");
  lines.push("Frequency Distribution:");
  lines.push(`  ${"Value".padEnd(12)} ${"Count".padEnd(8)} %`);
  for (const entry of stats.frequency) {
    lines.push(`  ${String(entry.value).padEnd(12)} ${String(entry.count).padEnd(8)} ${entry.percentage.toFixed(2)}%`);
  }
  lines.push("");
  lines.push("End of Report");

  return lines.join("\n");
}
