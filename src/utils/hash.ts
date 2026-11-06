// ============================================================================
// DataForge Toolkit — Hash Service
// Cryptographic hash generation (MD5, SHA1, SHA256, SHA512)
// ============================================================================

export type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512";

export interface HashResult {
  hash: string;
  algorithm: HashAlgorithm;
  input: string;
  byteLength: number;
}

// ---------------------------------------------------------------------------
// MD5 implementation (RFC 1321)
// ---------------------------------------------------------------------------

function md5(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const words = stringToWords(bytes);
  const md5Words = md5Core(words, bytes.length * 8);
  return wordsToHex(md5Words);
}

function stringToWords(bytes: Uint8Array): number[] {
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i++) {
    words[i >> 2] |= bytes[i] << ((3 - (i % 4)) * 8);
  }
  // Pad to at least 16 words (one MD5 block)
  while (words.length < 16) words.push(0);
  return words;
}

function md5Core(x: number[], len: number): number[] {
  x[len >> 5] |= 0x80 << ((24) - (len % 32) * 8);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;

    a = md5ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531502);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030502);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = (a + olda) | 0;
    b = (b + oldb) | 0;
    c = (c + oldc) | 0;
    d = (d + oldd) | 0;
  }

  return [a, b, c, d];
}

function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5AddRotate(md5Add(md5Add(a, md5F(b, c, d)), md5Add(x, t)), s);
}
function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5AddRotate(md5Add(md5Add(a, md5G(b, c, d)), md5Add(x, t)), s);
}
function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5AddRotate(md5Add(md5Add(a, md5H(b, c, d)), md5Add(x, t)), s);
}
function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5AddRotate(md5Add(md5Add(a, md5I(b, c, d)), md5Add(x, t)), s);
}

function md5F(x: number, y: number, z: number): number { return (x & y) | (~x & z); }
function md5G(x: number, y: number, z: number): number { return (x & z) | (y & ~z); }
function md5H(x: number, y: number, z: number): number { return x ^ y ^ z; }
function md5I(x: number, y: number, z: number): number { return y ^ (x | ~z); }

function md5Add(x: number, y: number): number {
  return (x + y) | 0;
}
function md5AddRotate(x: number, s: number): number {
  return (x << s) | (x >>> (32 - s));
}
function wordsToHex(words: number[]): string {
  let hex = "";
  for (let i = 0; i < words.length * 4; i++) {
    hex += (words[i >> 2] >>> ((3 - (i % 4)) * 8) & 0xff).toString(16).padStart(2, "0");
  }
  return hex;
}

// ---------------------------------------------------------------------------
// SHA-1 / SHA-256 / SHA-512 via Web Crypto API
// ---------------------------------------------------------------------------

async function shaDigest(algorithm: string, input: string): Promise<string> {
  const buf = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input));
  const arr = Array.from(new Uint8Array(buf));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------------------
// Main hash function
// ---------------------------------------------------------------------------

export async function hashString(input: string, algorithm: HashAlgorithm): Promise<HashResult> {
  let hash: string;
  if (algorithm === "md5") {
    hash = md5(input);
  } else {
    const algo = algorithm === "sha1" ? "SHA-1" : algorithm === "sha256" ? "SHA-256" : "SHA-512";
    hash = await shaDigest(algo, input);
  }

  return {
    hash,
    algorithm,
    input,
    byteLength: new TextEncoder().encode(input).length,
  };
}
