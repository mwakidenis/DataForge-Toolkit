import { describe, it, expect } from "vitest";
import {
  transformArray,
  parseArrayInput,
  deduplicateArray,
  chunkArray,
  groupArrayByFirstLetter,
  transformCase,
  filterArrayByRegex,
  joinArray,
} from "../services/arrayService";

describe("Array Service", () => {
  describe("parseArrayInput", () => {
    it("should split comma-separated values", () => {
      const result = parseArrayInput("a,b,c", { delimiter: "," });
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("should split newline-separated values", () => {
      const result = parseArrayInput("a\nb\nc", { delimiter: "\n" });
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("should trim values by default", () => {
      const result = parseArrayInput(" a , b , c ", { delimiter: "," });
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("should filter empty values by default", () => {
      const result = parseArrayInput("a,,b", { delimiter: "," });
      expect(result).toEqual(["a", "b"]);
    });

    it("should return empty array for empty input", () => {
      const result = parseArrayInput("", { delimiter: "," });
      expect(result).toEqual([]);
    });
  });

  describe("deduplicateArray", () => {
    it("should remove duplicates", () => {
      const result = deduplicateArray(["a", "b", "a", "c", "b"]);
      expect(result.unique).toEqual(["a", "b", "c"]);
      expect(result.removed).toEqual(["a", "b"]);
      expect(result.stats.count).toBe(5);
      expect(result.stats.unique).toBe(3);
    });

    it("should handle empty array", () => {
      const result = deduplicateArray([]);
      expect(result.unique).toEqual([]);
      expect(result.stats.count).toBe(0);
    });
  });

  describe("chunkArray", () => {
    it("should chunk array into specified size", () => {
      const result = chunkArray(["a", "b", "c", "d", "e"], 2);
      expect(result.chunks).toEqual([["a", "b"], ["c", "d"], ["e"]]);
      expect(result.chunkSize).toBe(2);
      expect(result.totalChunks).toBe(3);
    });

    it("should handle chunk size larger than array", () => {
      const result = chunkArray(["a", "b"], 10);
      expect(result.chunks).toEqual([["a", "b"]]);
      expect(result.totalChunks).toBe(1);
    });
  });

  describe("groupArrayByFirstLetter", () => {
    it("should group items by first letter", () => {
      const result = groupArrayByFirstLetter(["apple", "banana", "apricot", "cherry"]);
      expect(result.groups.A).toEqual(["apple", "apricot"]);
      expect(result.groups.B).toEqual(["banana"]);
      expect(result.groups.C).toEqual(["cherry"]);
      expect(result.groupCount).toBe(3);
    });

    it("should return empty groups for empty array", () => {
      const result = groupArrayByFirstLetter([]);
      expect(result.groupCount).toBe(0);
      expect(result.entries).toEqual([]);
    });
  });

  describe("transformCase", () => {
    it("should transform to camelCase, snakeCase, kebabCase", () => {
      const result = transformCase("hello world");
      expect(result.camelCase).toBe("helloWorld");
      expect(result.snakeCase).toBe("hello_world");
      expect(result.kebabCase).toBe("hello-world");
    });
  });

  describe("filterArrayByRegex", () => {
    it("should filter items matching regex", () => {
      const result = filterArrayByRegex(["apple", "banana", "cherry", "date"], "^a");
      expect(result.matched).toEqual(["apple"]);
      expect(result.filtered).toEqual(["banana", "cherry", "date"]);
      expect(result.matchCount).toBe(1);
    });

    it("should return all items when no match", () => {
      const result = filterArrayByRegex(["apple", "banana"], "^z");
      expect(result.matched).toEqual([]);
      expect(result.filtered).toEqual(["apple", "banana"]);
    });
  });

  describe("joinArray", () => {
    it("should join items with delimiter", () => {
      const result = joinArray(["a", "b", "c"], ", ");
      expect(result).toBe("a, b, c");
    });

    it("should use default comma delimiter", () => {
      const result = joinArray(["a", "b", "c"]);
      expect(result).toBe("a, b, c");
    });
  });

  describe("transformArray", () => {
    it("should run full pipeline", () => {
      const result = transformArray("apple, banana, apple, cherry", {
        delimiter: ",",
        chunkSize: 2,
      });
      expect(result.parsedCount).toBe(4);
      expect(result.dedup.unique).toEqual(["apple", "banana", "cherry"]);
      expect(result.chunk.totalChunks).toBe(2);
      expect(result.group.groupCount).toBe(3);
      expect(result.caseTransform.camelCase).toBe("appleBananaAppleCherry");
    });

    it("should apply regex filter when provided", () => {
      const result = transformArray("apple, banana, cherry, date", {
        delimiter: ",",
        chunkSize: 2,
        regexPattern: "^a",
      });
      expect(result.regexFilter).toBeDefined();
      expect(result.regexFilter?.matched).toEqual(["apple"]);
    });
  });
});
