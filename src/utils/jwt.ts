// ============================================================================
// DataForge Toolkit — JWT Service
// Decode JWT tokens (header.payload.signature)
// ============================================================================

export interface JwtDecodeResult {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  valid: boolean;
  error?: string;
  headerRaw: string;
  payloadRaw: string;
}

export interface JwtHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Base64Url decode helper (no padding, -/_ chars)
// ---------------------------------------------------------------------------

function base64UrlDecode(input: string): string {
  let normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4 !== 0) {
    normalized += "=";
  }
  return decodeURIComponent(escape(atob(normalized)));
}

// ---------------------------------------------------------------------------
// Decode JWT
// ---------------------------------------------------------------------------

export function decodeJwt(token: string): JwtDecodeResult {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return {
      header: {},
      payload: {},
      signature: "",
      valid: false,
      error: "Invalid JWT format: expected 3 parts separated by dots",
      headerRaw: "",
      payloadRaw: "",
    };
  }

  const [headerB64, payloadB64, signature] = parts;

  let header: Record<string, unknown> = {};
  let payload: Record<string, unknown> = {};
  let headerRaw = "";
  let payloadRaw = "";
  let valid = true;
  let error: string | undefined;

  try {
    headerRaw = base64UrlDecode(headerB64);
    header = JSON.parse(headerRaw);
  } catch {
    valid = false;
    error = error || "Invalid JWT header";
  }

  try {
    payloadRaw = base64UrlDecode(payloadB64);
    payload = JSON.parse(payloadRaw);
  } catch {
    valid = false;
    error = error || "Invalid JWT payload";
  }

  return { header, payload, signature, valid, error, headerRaw, payloadRaw };
}

// ---------------------------------------------------------------------------
// Validate JWT structure
// ---------------------------------------------------------------------------

export function isValidJwtFormat(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  return parts.every(
    (part) => part.length >= 8 && /^[A-Za-z0-9_-]+$/.test(part)
  );
}
