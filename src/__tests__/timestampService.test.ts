import { describe, it, expect } from "vitest";
import { timestampFromReadable, timestampToReadable, currentTimestamp } from "../utils/timestamp";

describe("Timestamp Service", () => {
  describe("timestampFromReadable", () => {
    it("should parse ISO date", () => {
      const result = timestampFromReadable("2024-11-06T10:00:00Z");
      expect(result.valid).toBe(true);
      expect(result.unix).toBe(1730887200);
    });

    it("should reject invalid date", () => {
      const result = timestampFromReadable("not-a-date");
      expect(result.valid).toBe(false);
    });
  });

  describe("timestampToReadable", () => {
    it("should convert unix seconds", () => {
      const result = timestampToReadable(1730893200, "seconds");
      expect(result.valid).toBe(true);
      expect(result.unix).toBe(1730893200);
      expect(result.iso).toContain("2024-11-06");
    });

    it("should convert unix milliseconds", () => {
      const result = timestampToReadable(1730893200000, "milliseconds");
      expect(result.valid).toBe(true);
      expect(result.unix).toBe(1730893200);
    });
  });

  describe("currentTimestamp", () => {
    it("should return current time", () => {
      const result = currentTimestamp();
      expect(result.unix).toBeGreaterThan(0);
      expect(result.iso).toContain("T");
      expect(result.readable).toBeTruthy();
    });
  });
});
