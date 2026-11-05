# DataForge Toolkit Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-05

### Added

- Dashboard layout with top navbar and tab navigation across three tools
- Tool 1: Array & Text Transformer (unique, chunk, groupBy, camelCase/snakeCase/kebabCase) powered by `@mwakidenis/logx` and `@mwakidenis/logx-react`
- Tool 2: Object & JSON Inspector (deep get/set/clone/pick/omit) with localStorage-persisted snippets
- Tool 3: Statistical Quick-Calculator (sum, mean, median, mode, variance, standard deviation, min, max)
- `@mwakidenis/logx-react` package with `useDebouncedValue`, `useCounter`, `useLocalStorage`, `ErrorBoundary`, and `CopyButton`
- `ErrorBoundary` wrapper for graceful error handling
- Dark/light neutral card-based responsive UI
- GitHub Actions CI workflow (typecheck, lint, build)
- MIT License, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, CITATION.cff

### Changed

- N/A

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- Disabled snippet saving when JSON input is invalid

### Security

- N/A

[1.0.0]: https://github.com/mwakidenis/DataForge-Toolkit/releases/tag/v1.0.0
