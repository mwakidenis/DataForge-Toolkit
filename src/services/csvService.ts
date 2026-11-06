// ============================================================================
// DataForge Toolkit — CSV Service
// Bidirectional CSV ⇄ JSON conversion
// ============================================================================

import type { CsvParseOptions, CsvParseResult, CsvRow, CsvStringifyResult } from "./types";

// ---------------------------------------------------------------------------
// CSV Parsing
// ---------------------------------------------------------------------------

export function parseCsv(input: string, opts: CsvParseOptions): CsvParseResult {
  const { delimiter = ",", hasHeader = true, trimValues = true } = opts;

  if (!input || !input.trim()) {
    return { headers: [], rows: [], rowCount: 0, delimiter, hasHeader };
  }

  const lines = input.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [], rowCount: 0, delimiter, hasHeader };
  }

  const splitLine = (line: string): string[] => {
    // Simple delimiter-based splitting (handles basic CSV without quoted fields)
    return line.split(delimiter).map((cell) => (trimValues ? cell.trim() : cell));
  };

  let headers: string[] = [];
  let dataStart = 0;

  if (hasHeader && lines.length > 0) {
    headers = splitLine(lines[0]);
    dataStart = 1;
  } else {
    // Generate column names
    const firstRow = splitLine(lines[0]);
    headers = firstRow.map((_, i) => `Column ${i + 1}`);
  }

  const rows: CsvRow[] = [];
  for (let i = dataStart; i < lines.length; i++) {
    const values = splitLine(lines[i]);
    const row: CsvRow = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] !== undefined ? values[idx] : "";
    });
    rows.push(row);
  }

  return { headers, rows, rowCount: rows.length, delimiter, hasHeader };
}

// ---------------------------------------------------------------------------
// CSV Stringify (JSON to CSV)
// ---------------------------------------------------------------------------

export function stringifyCsv(
  data: CsvRow[] | string,
  opts: CsvParseOptions = { delimiter: ",", hasHeader: true, trimValues: true }
): CsvStringifyResult {
  const { delimiter = ",", hasHeader = true } = opts;

  let rows: CsvRow[] = [];

  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        rows = parsed as CsvRow[];
      } else {
        rows = [parsed as CsvRow];
      }
    } catch {
      return { csv: "", headers: [], rowCount: 0 };
    }
  } else {
    rows = data;
  }

  if (rows.length === 0) {
    return { csv: "", headers: [], rowCount: 0 };
  }

  // Collect all headers
  const headerSet = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((k) => headerSet.add(k)));
  const headers = Array.from(headerSet);

  const escapeCell = (cell: unknown): string => {
    const str = String(cell ?? "");
    if (str.includes(delimiter) || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines: string[] = [];
  if (hasHeader) {
    lines.push(headers.map((h) => escapeCell(h)).join(delimiter));
  }
  rows.forEach((row) => {
    lines.push(headers.map((h) => escapeCell(row[h])).join(delimiter));
  });

  return { csv: lines.join("\n"), headers, rowCount: rows.length };
}

// ---------------------------------------------------------------------------
// Detect delimiter
// ---------------------------------------------------------------------------

export function detectDelimiter(input: string): "," | ";" | "\t" | "|" {
  const candidates: Array<"," | ";" | "\t" | "|"> = [",", ";", "\t", "|"];
  const firstLine = input.split(/\r?\n/)[0] || "";

  let best: "," | ";" | "\t" | "|" = ",";
  let bestCount = 0;

  for (const cand of candidates) {
    const count = (firstLine.match(new RegExp(`\\${cand}`, "g")) || []).length;
    if (count > bestCount) {
      bestCount = count;
      best = cand;
    }
  }

  return bestCount > 0 ? best : ",";
}
