// ============================================================================
// DataForge Toolkit — Timestamp Service
// Unix timestamp ↔ human readable conversions
// ============================================================================

export interface TimestampResult {
  unix: number;
  iso: string;
  readable: string;
  valid: boolean;
  error?: string;
}

export type TimestampUnit = "seconds" | "milliseconds";

// ---------------------------------------------------------------------------
// Convert human readable → unix
// ---------------------------------------------------------------------------

export function timestampFromReadable(input: string): TimestampResult {
  let date: Date;

  // Try ISO format first
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) {
    date = new Date(input);
  } else {
    date = new Date(input);
  }

  if (isNaN(date.getTime())) {
    return { unix: 0, iso: "", readable: "", valid: false, error: "Invalid date format" };
  }

  return {
    unix: Math.floor(date.getTime() / 1000),
    iso: date.toISOString(),
    readable: date.toLocaleString(),
    valid: true,
  };
}

// ---------------------------------------------------------------------------
// Convert unix → human readable
// ---------------------------------------------------------------------------

export function timestampToReadable(unix: number, unit: TimestampUnit = "seconds"): TimestampResult {
  const ms = unit === "seconds" ? unix * 1000 : unix;
  const date = new Date(ms);

  if (isNaN(date.getTime())) {
    return { unix: 0, iso: "", readable: "", valid: false, error: "Invalid timestamp" };
  }

  return {
    unix: unit === "seconds" ? unix : Math.floor(ms / 1000),
    iso: date.toISOString(),
    readable: date.toLocaleString(),
    valid: true,
  };
}

// ---------------------------------------------------------------------------
// Current timestamp
// ---------------------------------------------------------------------------

export function currentTimestamp(): { unix: number; iso: string; readable: string } {
  const now = new Date();
  return {
    unix: Math.floor(now.getTime() / 1000),
    iso: now.toISOString(),
    readable: now.toLocaleString(),
  };
}
