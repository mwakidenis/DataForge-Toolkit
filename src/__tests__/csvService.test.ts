import { describe, it, expect } from "vitest";
import { parseCsv, stringifyCsv, detectDelimiter } from "../services/csvService";

describe("CSV Service", () => {
  describe("parseCsv", () => {
    it("should parse CSV with header", () => {
      const result = parseCsv("name,age,city\nAlice,30,New York\nBob,25,London", {
        delimiter: ",",
        hasHeader: true,
      });
      expect(result.headers).toEqual(["name", "age", "city"]);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({ name: "Alice", age: "30", city: "New York" });
      expect(result.rowCount).toBe(2);
    });

    it("should parse CSV without header", () => {
      const result = parseCsv("Alice,30\nBob,25", {
        delimiter: ",",
        hasHeader: false,
      });
      expect(result.headers).toEqual(["Column 1", "Column 2"]);
      expect(result.rows).toHaveLength(2);
    });

    it("should handle empty input", () => {
      const result = parseCsv("", { delimiter: "," });
      expect(result.rows).toEqual([]);
      expect(result.rowCount).toBe(0);
    });
  });

  describe("stringifyCsv", () => {
    it("should convert JSON array to CSV", () => {
      const result = stringifyCsv([
        { name: "Alice", age: "30" },
        { name: "Bob", age: "25" },
      ], { delimiter: ",", hasHeader: true });
      expect(result.csv).toContain("name,age");
      expect(result.csv).toContain("Alice,30");
      expect(result.rowCount).toBe(2);
    });

    it("should convert JSON string to CSV", () => {
      const result = stringifyCsv('[{"name":"Alice","age":"30"}]', {
        delimiter: ",",
        hasHeader: true,
      });
      expect(result.csv).toContain("Alice");
    });
  });

  describe("detectDelimiter", () => {
    it("should detect comma delimiter", () => {
      const result = detectDelimiter("a,b,c");
      expect(result).toBe(",");
    });

    it("should detect semicolon delimiter", () => {
      const result = detectDelimiter("a;b;c");
      expect(result).toBe(";");
    });

    it("should detect tab delimiter", () => {
      const result = detectDelimiter("a\tb\tc");
      expect(result).toBe("\t");
    });

    it("should default to comma", () => {
      const result = detectDelimiter("abc");
      expect(result).toBe(",");
    });
  });
});
