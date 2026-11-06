import { describe, it, expect } from "vitest";
import { deepDiff, formatDiffForDisplay } from "../services/diffService";

describe("Diff Service", () => {
  describe("deepDiff", () => {
    it("should detect added keys", () => {
      const result = deepDiff({ a: 1 }, { a: 1, b: 2 });
      expect(result.added).toHaveProperty("b");
      expect(result.added.b).toBe(2);
      expect(Object.keys(result.removed)).toHaveLength(0);
    });

    it("should detect removed keys", () => {
      const result = deepDiff({ a: 1, b: 2 }, { a: 1 });
      expect(result.removed).toHaveProperty("b");
      expect(result.removed.b).toBe(2);
    });

    it("should detect modified keys", () => {
      const result = deepDiff({ a: 1 }, { a: 2 });
      expect(result.modified).toHaveProperty("a");
      expect(result.modified.a).toEqual({ before: 1, after: 2 });
    });

    it("should detect unchanged keys", () => {
      const result = deepDiff({ a: 1, b: 2 }, { a: 1, b: 2 });
      expect(result.unchanged).toHaveProperty("a");
      expect(result.unchanged).toHaveProperty("b");
    });

    it("should handle nested objects", () => {
      const result = deepDiff(
        { user: { name: "Ada", age: 36 } },
        { user: { name: "Grace", age: 36 } }
      );
      expect(result.modified).toHaveProperty("name");
      expect(result.modified["name"]).toEqual({ before: "Ada", after: "Grace" });
      expect(result.changes.some((c) => c.path === "user.name")).toBe(true);
    });

    it("should compute similarity score", () => {
      const result = deepDiff({ a: 1, b: 2 }, { a: 1, c: 3 });
      expect(result.similarityScore).toBeGreaterThanOrEqual(0);
      expect(result.similarityScore).toBeLessThanOrEqual(1);
    });

    it("should return similarity 1 for identical objects", () => {
      const result = deepDiff({ a: 1 }, { a: 1 });
      expect(result.similarityScore).toBe(1);
    });
  });

  describe("formatDiffForDisplay", () => {
    it("should format diff summary", () => {
      const result = deepDiff({ a: 1, b: 2 }, { a: 1, c: 3 });
      const display = formatDiffForDisplay(result);
      expect(display.summary).toContain("modified");
      expect(display.summary).toContain("added");
      expect(display.summary).toContain("removed");
    });
  });
});
