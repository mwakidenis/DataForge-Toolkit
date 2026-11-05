# DataForge Toolkit

A production-ready, single-page client-side web application for array, object, and statistical data transformations — powered by `@mwakidenis/logx` and `@mwakidenis/logx-react`.

## Features

- **Array & Text Transformer** — deduplication, chunking, grouping by first letter, and case conversion (camelCase, snakeCase, kebabCase) with debounced input.
- **Object & JSON Inspector** — safe deep `get`, `set`, `deepClone`, `pick`, and `omit` with localStorage-persisted snippets.
- **Statistical Quick-Calculator** — sum, mean, median, mode, variance, standard deviation, min, and max.
- **Stability** — wrapped in an `ErrorBoundary` for graceful error handling.

## Tech Stack

- React 18 + TypeScript (Vite)
- `@mwakidenis/logx` — core utilities (array, object, string, math)
- `@mwakidenis/logx-react` — hooks (`useDebouncedValue`, `useCounter`, `useLocalStorage`) and UI components (`ErrorBoundary`, `CopyButton`)
- Dark/light neutral card-based dashboard layout

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  App.tsx              # ErrorBoundary-wrapped tab router
  main.tsx             # React entry point
  index.css            # Global styles
  components/
    ArrayTransformer.tsx
    JsonInspector.tsx
    StatsCalculator.tsx
```

## License

MIT
