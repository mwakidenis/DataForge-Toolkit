// ============================================================================
// DataForge Toolkit — Base64 Utilities
// Base64 encode/decode with URL-safe and standard variants
// ============================================================================

export interface Base64EncodeResult {
  encoded: string;
  original: string;
  byteLength: number;
}

export interface Base64DecodeResult {
  decoded: string;
  original: string;
  valid: boolean;
}

// ---------------------------------------------------------------------------
// Encode
// ---------------------------------------------------------------------------

export function base64Encode(input: string, urlSafe: boolean = false): Base64EncodeResult {
  const encoded = btoa(unescape(encodeURIComponent(input)));
  const result = urlSafe ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : encoded;
  return {
    encoded: result,
    original: input,
    byteLength: new TextEncoder().encode(input).length,
  };
}

// ---------------------------------------------------------------------------
// Decode
// ---------------------------------------------------------------------------

export function base64Decode(input: string, urlSafe: boolean = false): Base64DecodeResult {
  let normalized = input;
  if (urlSafe) {
    normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");
    // Pad to multiple of 4
    while (normalized.length % 4 !== 0) {
      normalized += "=";
    }
  }

  let decoded: string;
  let valid = true;
  try {
    decoded = decodeURIComponent(escape(atob(normalized)));
  } catch {
    decoded = input;
    valid = false;
  }
  return { decoded, original: input, valid };
}

// ---------------------------------------------------------------------------
// Validate
// ---------------------------------------------------------------------------

export function isValidBase64(input: string, urlSafe: boolean = false): boolean {
  if (urlSafe) {
    return /^[A-Za-z0-9_-]*$/g.test(input);
  }
  return /^[A-Za-z0-9+/]*={0,2}$/g.test(input) && input.length % 4 === 0;
}
