// ============================================================================
// DataForge Toolkit — Local String Utilities
// Inlined from @mwakidenis/logx/string for self-contained builds
// ============================================================================

export function camelCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

export function snakeCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

export function kebabCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}
