// ============================================================================
// DataForge Toolkit — URL Service
// URL encoding and decoding utilities
// ============================================================================

export interface UrlEncodeResult {
  encoded: string;
  original: string;
  method: "encodeURIComponent" | "encodeURI";
}

export interface UrlDecodeResult {
  decoded: string;
  original: string;
  valid: boolean;
}

// ---------------------------------------------------------------------------
// Encode
// ---------------------------------------------------------------------------

export function urlEncode(input: string, method: "encodeURIComponent" | "encodeURI" = "encodeURIComponent"): UrlEncodeResult {
  const encoded = method === "encodeURIComponent" ? encodeURIComponent(input) : encodeURI(input);
  return { encoded, original: input, method };
}

// ---------------------------------------------------------------------------
// Decode
// ---------------------------------------------------------------------------

export function urlDecode(input: string): UrlDecodeResult {
  let decoded: string;
  let valid = true;
  try {
    decoded = decodeURIComponent(input);
  } catch {
    decoded = input;
    valid = false;
  }
  return { decoded, original: input, valid };
}

// ---------------------------------------------------------------------------
// Encode query parameters from object
// ---------------------------------------------------------------------------

export interface QueryParams {
  [key: string]: string | number | boolean;
}

export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, String(value));
  }
  return searchParams.toString();
}

// ---------------------------------------------------------------------------
// Parse query string into object
// ---------------------------------------------------------------------------

export function parseQueryString(query: string): QueryParams {
  const clean = query.replace(/^\?/, "");
  const searchParams = new URLSearchParams(clean);
  const params: QueryParams = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
}
