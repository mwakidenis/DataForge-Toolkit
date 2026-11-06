import { describe, it, expect } from "vitest";
import {
  testRegex,
  findAllMatches,
  replaceRegex,
  validateRegex,
} from "../services/regexService";

describe("Regex Service", () => {
  describe("validateRegex", () => {
    it("should validate correct pattern", () => {
      const result = validateRegex("\\d+", "");
      expect(result.valid).toBe(true);
    });

    it("should reject invalid pattern", () => {
      const result = validateRegex("[invalid", "");
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("testRegex", () => {
    it("should find matches", () => {
      const result = testRegex("The lazy dog runs fast", "\\b\\w{4}\\b", "g");
      expect(result.hasMatch).toBe(true);
      expect(result.matchCount).toBeGreaterThan(0);
    });

    it("should return no match for non-matching pattern", () => {
      const result = testRegex("hello world", "^z", "");
      expect(result.hasMatch).toBe(false);
      expect(result.matchCount).toBe(0);
    });

    it("should return match index", () => {
      const result = testRegex("The quick brown fox", "quick", "");
      expect(result.index).toBe(4);
    });
  });

  describe("findAllMatches", () => {
    it("should find all global matches", () => {
      const result = findAllMatches("cat bat rat fat mat", "at", "g");
      expect(result.matchCount).toBe(5);
    });
  });

  describe("replaceRegex", () => {
    it("should replace matched patterns", () => {
      const result = replaceRegex("cat bat rat", "at", "ot", "g");
      expect(result.result).toBe("cot bot rot");
      expect(result.replacements).toBe(3);
    });

    it("should return original when no match", () => {
      const result = replaceRegex("hello", "xyz", "abc", "");
      expect(result.result).toBe("hello");
      expect(result.replacements).toBe(0);
    });
  });
});
