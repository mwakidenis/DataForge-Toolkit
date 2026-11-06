# DataForge Toolkit

A production-ready, single-page client-side web application for array, object, and statistical data transformations — powered by `@mwakidenis/logx` and `@mwakidenis/logx-react`.

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

### Architecture

- **Service Layer** (`src/services/`): Pure TypeScript service functions leveraging `@mwakidenis/logx` utilities — `arrayService`, `jsonService`, `statsService`, `csvService`, `regexService`, `diffService`
- **Error Boundary** wrapping the entire app for graceful error handling
- **Persistent state** via `useLocalStorage` for user inputs and preferences across sessions
- **Debounced input** via `useDebouncedValue` to prevent layout lag

## Tech Stack

- React 18 + TypeScript (Vite)
- `@mwakidenis/logx` — core utilities (array, object, string, math)
- `@mwakidenis/logx-react` — hooks (`useDebouncedValue`, `useCounter`, `useLocalStorage`) and UI components (`ErrorBoundary`, `CopyButton`)
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
  App.tsx              # ErrorBoundary-wrapped tab router with 6-tool navigation
  main.tsx             # React entry point
  index.css            # AdminLTE-style global styles
  components/
    ArrayTransformer.tsx     # Array & text transformation workbench
    JsonInspector.tsx        # Deep JSON object inspector
    StatsCalculator.tsx      # Statistical quick-calculator
    CsvConverter.tsx         # CSV ⇄ JSON bidirectional converter
    RegexTester.tsx          # Live regex testing workbench
    ObjectDiff.tsx           # Deep object structural comparison
  services/
    index.ts             # Services barrel export
    types.ts             # Shared TypeScript types and interfaces
    arrayService.ts      # Array operations (dedupe, chunk, group, case, regex filter)
    jsonService.ts       # JSON operations (get, set, clone, pick, omit, validate)
    statsService.ts      # Statistical computations (percentiles, IQR, frequency)
    csvService.ts        # CSV parsing and stringification
    regexService.ts      # Regex matching, replacement, validation
    diffService.ts       # Deep object diff with similarity scoring
  __tests__/
    arrayService.test.ts
    jsonService.test.ts
    statsService.test.ts
    csvService.test.ts
    regexService.test.ts
    diffService.test.ts
```

## Quality Gates

- `npm run typecheck` — TypeScript strict mode, zero errors
- `npm run test` — Vitest: 68 tests passing across 6 service test files
- `npm run build` — Vite production build, zero errors
- Cloudflare Pages ready (`wrangler.toml`, `_redirects` for SPA fallback)

## License

MIT
