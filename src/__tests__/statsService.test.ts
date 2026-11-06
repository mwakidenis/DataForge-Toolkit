import { describe, it, expect } from "vitest";
import {
  parseNumbers,
  computeStats,
  transformStats,
  generateSummaryReport,
} from "../services/statsService";

describe("Stats Service", () => {
  describe("parseNumbers", () => {
    it("should parse comma-separated numbers", () => {
      const result = parseNumbers("1, 2, 3, 4, 5");
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should parse newline-separated numbers", () => {
      const result = parseNumbers("1\n2\n3", { delimiter: "\n" });
      expect(result).toEqual([1, 2, 3]);
    });

    it("should filter out NaN values", () => {
      const result = parseNumbers("1, abc, 3");
      expect(result).toEqual([1, 3]);
    });

    it("should return empty array for empty input", () => {
      const result = parseNumbers("");
      expect(result).toEqual([]);
    });
  });

  describe("computeStats", () => {
    it("should compute basic statistics", () => {
      const result = computeStats([1, 2, 3, 4, 5]);
      expect(result.count).toBe(5);
      expect(result.sum).toBe(15);
      expect(result.mean).toBe(3);
      expect(result.median).toBe(3);
      expect(result.min).toBe(1);
      expect(result.max).toBe(5);
      expect(result.range).toBe(4);
    });

    it("should handle single value", () => {
      const result = computeStats([42]);
      expect(result.count).toBe(1);
      expect(result.sum).toBe(42);
      expect(result.mean).toBe(42);
      expect(result.median).toBe(42);
      expect(result.variance).toBe(0);
      expect(result.stdDev).toBe(0);
    });

    it("should handle empty array", () => {
      const result = computeStats([]);
      expect(result.count).toBe(0);
      expect(result.sum).toBe(0);
      expect(result.mean).toBe(0);
    });

    it("should compute mode", () => {
      const result = computeStats([1, 2, 2, 3, 3, 3]);
      expect(result.mode).toContain(3);
    });
  });

  describe("transformStats", () => {
    it("should run full pipeline", () => {
      const result = transformStats("1, 2, 3, 4, 5");
      expect(result.parsedCount).toBe(5);
      expect(result.numbers).toEqual([1, 2, 3, 4, 5]);
      expect(result.stats.count).toBe(5);
      expect(result.sorted).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("generateSummaryReport", () => {
    it("should generate a text report", () => {
      const stats = computeStats([1, 2, 3]);
      const report = generateSummaryReport(stats, "1, 2, 3");
      expect(report).toContain("DataForge Toolkit");
      expect(report).toContain("Statistical Summary Report");
      expect(report).toContain("Count:");
      expect(report).toContain("Mean:");
    });
  });

  describe("percentiles", () => {
    it("should compute percentiles", () => {
      const result = computeStats([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(result.p25).toBeGreaterThanOrEqual(1);
      expect(result.p75).toBeLessThanOrEqual(10);
      expect(result.p90).toBeGreaterThan(result.p75);
    });
  });

  describe("frequency distribution", () => {
    it("should compute frequency table", () => {
      const result = computeStats([1, 1, 2, 2, 2, 3]);
      const freq2 = result.frequency.find((f) => f.value === 2);
      expect(freq2?.count).toBe(3);
      expect(freq2?.percentage).toBe(50);
    });
  });
});
