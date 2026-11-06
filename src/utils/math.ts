// ============================================================================
// DataForge Toolkit — Local Math Utilities
// Inlined from @mwakidenis/logx/math for self-contained builds
// ============================================================================

export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

export function mean(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }
  return sum(numbers) / numbers.length;
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid] ?? 0;
}

export function min(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error("min expects a non-empty array");
  }
  return Math.min(...numbers);
}

export function max(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error("max expects a non-empty array");
  }
  return Math.max(...numbers);
}

export function mode(numbers: number[]): number[] {
  if (numbers.length === 0) {
    return [];
  }
  const freq = new Map<number, number>();
  for (const n of numbers) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }
  let maxCount = 0;
  for (const count of freq.values()) {
    if (count > maxCount) {
      maxCount = count;
    }
  }
  const result: number[] = [];
  for (const [num, count] of freq) {
    if (count === maxCount) {
      result.push(num);
    }
  }
  return result;
}

export function variance(numbers: number[]): number {
  if (numbers.length === 0) {
    return 0;
  }
  const avg = mean(numbers);
  return sum(numbers.map((n) => Math.pow(n - avg, 2))) / numbers.length;
}

export function standardDeviation(numbers: number[]): number {
  return Math.sqrt(variance(numbers));
}
