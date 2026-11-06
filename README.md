# DataForge Toolkit

A production-ready, single-page client-side web application for array, object, and statistical data transformations.

## Features

### Core Tools

| Tool | Icon | Description |
|------|------|-------------|
| **Array & Text Transformer** | `bi-sliders` | Deduplication, chunking, grouping by first letter, case conversion (camelCase/snakeCase/kebabCase), regex filtering, custom delimiters, live item counters |
| **Object & JSON Inspector** | `bi-file-earmark-text` | Safe deep `get`, `set`, `deepClone`, `pick`, `omit` with JSON path querying, tree/raw view toggle, syntax validation, localStorage-persisted snippets |
| **Statistical Calculator** | `bi-calculator` | Sum, mean, median, mode, variance, standard deviation, min, max, range, IQR, percentiles (P25/P50/P75/P90/P95), frequency distribution, downloadable reports |
| **CSV Converter** | `bi-file-earmark-spreadsheet` | Bidirectional CSV ⇄ JSON conversion with live tabular preview, delimiter selection (comma, tab, semicolon, pipe), header detection, auto-detect delimiter, downloadable exports |
| **Regex Tester** | `bi-patch-exclamation` | Live regex matching with flags (g, i, m, s), match highlighting, capture group breakdown, find-all-matches, string replacement bench |
| **Object Diff** | `bi-git` | Side-by-side deep structural comparison of two JSON objects, highlighting added/removed/modified/unchanged keys with similarity score |
| **URL Encoder / Decoder** | `bi-link-45deg` | URL encode/decode with `encodeURIComponent`/`encodeURI` methods, query string builder/parser, validity indicator |
| **Base64 Encoder / Decoder** | `bi-file-earmark-font` | Base64 encode/decode with standard and URL-safe variants, byte count, validity indicator |
| **JWT Decoder** | `bi-tag` | Decode JWT header.payload.signature, view header/payload/signature separately |
| **Hash Generator** | `bi-lock` | MD5, SHA-1, SHA-256, SHA-512 hashing with all-algorithms comparison |
| **Color Converter** | `bi-palette` | Convert between HEX, RGB, and HSL color formats with live preview |
| **Timestamp Converter** | `bi-clock` | Unix timestamp ↔ human readable date, ISO 8601 output, current time |

### Architecture

- **Service Layer** (`src/services/`): Pure TypeScript service functions — `arrayService`, `jsonService`, `statsService`, `csvService`, `regexService`, `diffService`, `urlService`
- **Utility Layer** (`src/utils/`): Inlined `@mwakidenis/logx` implementations — `array`, `object`, `string`, `math`, `base64`, `jwt`, `hash`, `color`, `timestamp`
- **Hook Layer** (`src/hooks/`): Inlined `@mwakidenis/logx-react` hooks — `useDebouncedValue`, `useCounter`, `useLocalStorage`
- **UI Layer** (`src/ui/`): Inlined `@mwakidenis/logx-react` components — `ErrorBoundary`, `CopyButton`
- **Error Boundary** wrapping the entire app for graceful error handling
- **Persistent state** via `useLocalStorage` for user inputs and preferences across sessions
- **Debounced input** via `useDebouncedValue` to prevent layout lag

## Tech Stack

- React 18 + TypeScript (Vite)
- All utilities inlined (no external `@mwakidenis/*` npm dependencies)
- Professional AdminLTE-style dashboard with dark/light neutral card-based layout, Bootstrap Icons

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript strict check |
| `npm run test` | Run Vitest test suite |
| `npm run lint` | ESLint |
| `npm run deploy` | Deploy to Cloudflare Pages |

## Project Structure

```
src/
  App.tsx              # ErrorBoundary-wrapped tab router with 12-tool navigation
  main.tsx             # React entry point
  index.css            # AdminLTE-style global styles
  components/
    ArrayTransformer.tsx     # Array & text transformation workbench
    JsonInspector.tsx        # Deep JSON object inspector
    StatsCalculator.tsx      # Statistical quick-calculator
    CsvConverter.tsx         # CSV ⇄ JSON bidirectional converter
    RegexTester.tsx          # Live regex testing workbench
    ObjectDiff.tsx           # Deep object structural comparison
    UrlEncoder.tsx           # URL encoder/decoder with query params
    Base64Converter.tsx      # Base64 encoder/decoder
    JwtDecoder.tsx           # JWT token decoder
    HashGenerator.tsx        # MD5/SHA hash generator
    ColorConverter.tsx       # HEX/RGB/HSL color converter
    TimestampConverter.tsx   # Unix timestamp converter
  services/
    index.ts                 # Services barrel export
    types.ts                 # Shared TypeScript types and interfaces
    arrayService.ts          # Array operations (dedupe, chunk, group, case, regex filter)
    jsonService.ts           # JSON operations (get, set, clone, pick, omit, validate)
    statsService.ts          # Statistical computations (percentiles, IQR, frequency)
    csvService.ts            # CSV parsing and stringification
    regexService.ts          # Regex matching, replacement, validation
    diffService.ts           # Deep object diff with similarity scoring
    urlService.ts            # URL encoding/decoding, query string builder/parser
    base64.ts                # Base64 encode/decode
    jwt.ts                   # JWT token decoding
    hash.ts                  # MD5/SHA1/SHA256/SHA512 hashing
    color.ts                 # HEX/RGB/HSL color conversions
    timestamp.ts             # Unix timestamp conversions
  __tests__/
    arrayService.test.ts
    jsonService.test.ts
    statsService.test.ts
    csvService.test.ts
    regexService.test.ts
    diffService.test.ts
    urlService.test.ts
    base64Service.test.ts
    jwtService.test.ts
    hashService.test.ts
    colorService.test.ts
    timestampService.test.ts
```

## Quality Gates

- `npm run typecheck` — TypeScript strict mode, zero errors
- `npm run test` — Vitest: 104 tests passing across 12 service test files
- `npm run build` — Vite production build, zero errors
- Cloudflare Pages ready (`wrangler.toml`, `_redirects` for SPA fallback)

## License

MIT
