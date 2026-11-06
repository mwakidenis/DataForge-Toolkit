// ============================================================================
// DataForge Toolkit — Color Service
// Hex / RGB / HSL color conversions
// ============================================================================

export type ColorFormat = "hex" | "rgb" | "hsl";

export interface ColorResult {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  valid: boolean;
  error?: string;
}

export interface ParseResult {
  hex: string;
  rgb: string;
  hsl: string;
  valid: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    h = max === rr ? ((gg - bb) / diff) % 6 : max === gg ? (bb - rr) / diff + 2 : (rr - gg) / diff + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s = s / 100;
  l = l / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

export function parseColor(input: string): ColorResult {
  const trimmed = input.trim();

  // Hex
  if (/^#([0-9a-fA-F]{3}){1,2}$/.test(trimmed)) {
    const rgb = hexToRgb(trimmed);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hex6 = trimmed.length === 4
        ? "#" + trimmed[1] + trimmed[1] + trimmed[2] + trimmed[2] + trimmed[3] + trimmed[3]
        : trimmed.toLowerCase();
      return { hex: hex6, rgb, hsl, valid: true };
    }
  }

  // RGB
  const rgbMatch = trimmed.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      const hsl = rgbToHsl(r, g, b);
      return { hex: rgbToHex(r, g, b), rgb: { r, g, b }, hsl, valid: true };
    }
  }

  // HSL
  const hslMatch = trimmed.match(/^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10);
    const s = parseInt(hslMatch[2], 10);
    const l = parseInt(hslMatch[3], 10);
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
      const rgb = hslToRgb(h, s, l);
      return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb, hsl: { h, s, l }, valid: true };
    }
  }

  return { hex: "", rgb: { r: 0, g: 0, b: 0 }, hsl: { h: 0, s: 0, l: 0 }, valid: false, error: "Invalid color format" };
}

// ---------------------------------------------------------------------------
// Format outputs
// ---------------------------------------------------------------------------

export function formatColorResult(input: string): ParseResult {
  const result = parseColor(input);
  if (!result.valid) {
    return { hex: "", rgb: "", hsl: "", valid: false };
  }

  return {
    hex: result.hex,
    rgb: `rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})`,
    hsl: `hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`,
    valid: true,
  };
}
