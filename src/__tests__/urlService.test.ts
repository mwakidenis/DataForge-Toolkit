import { describe, it, expect } from "vitest";
import { urlEncode, urlDecode, buildQueryString, parseQueryString } from "../services/urlService";

describe("URL Service", () => {
  describe("urlEncode", () => {
    it("should encode special characters with encodeURIComponent", () => {
      const result = urlEncode("https://example.com?q=hello world");
      expect(result.encoded).toBe("https%3A%2F%2Fexample.com%3Fq%3Dhello%20world");
    });

    it("should preserve URI characters with encodeURI", () => {
      const result = urlEncode("https://example.com/path", "encodeURI");
      expect(result.encoded).toBe("https://example.com/path");
    });
  });

  describe("urlDecode", () => {
    it("should decode percent-encoded URL", () => {
      const result = urlDecode("https%3A%2F%2Fexample.com%2Fq%3Dhello%20world");
      expect(result.decoded).toBe("https://example.com/q=hello world");
      expect(result.valid).toBe(true);
    });

    it("should mark invalid encoding", () => {
      const result = urlDecode("%XX");
      expect(result.valid).toBe(false);
    });
  });

  describe("buildQueryString", () => {
    it("should build query string from object", () => {
      const result = buildQueryString({ name: "John Doe", city: "New York" });
      expect(result).toContain("name=John+Doe");
      expect(result).toContain("city=New+York");
    });
  });

  describe("parseQueryString", () => {
    it("should parse query string into object", () => {
      const result = parseQueryString("name=John+Doe&city=New+York");
      expect(result.name).toBe("John Doe");
      expect(result.city).toBe("New York");
    });

    it("should handle leading question mark", () => {
      const result = parseQueryString("?name=test");
      expect(result.name).toBe("test");
    });
  });
});
