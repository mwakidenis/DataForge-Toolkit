import { describe, it, expect } from "vitest";
import { base64Encode, base64Decode, isValidBase64 } from "../utils/base64";

describe("Base64 Service", () => {
  describe("base64Encode", () => {
    it("should encode a plain string", () => {
      const result = base64Encode("Hello, World!");
      expect(result.encoded).toBe("SGVsbG8sIFdvcmxkIQ==");
      expect(result.original).toBe("Hello, World!");
    });

    it("should encode with URL-safe variant", () => {
      const result = base64Encode("Hello/World+Test", true);
      expect(result.encoded).not.toContain("+");
      expect(result.encoded).not.toContain("/");
      expect(result.encoded).not.toContain("=");
    });

    it("should report byte length", () => {
      const result = base64Encode("Hi");
      expect(result.byteLength).toBeGreaterThan(0);
    });
  });

  describe("base64Decode", () => {
    it("should decode a valid base64 string", () => {
      const result = base64Decode("SGVsbG8sIFdvcmxkIQ==");
      expect(result.decoded).toBe("Hello, World!");
      expect(result.valid).toBe(true);
    });

    it("should decode URL-safe base64", () => {
      const encoded = base64Encode("Hello/World+Test", true).encoded;
      const result = base64Decode(encoded, true);
      expect(result.decoded).toBe("Hello/World+Test");
    });

    it("should mark invalid base64", () => {
      const result = base64Decode("!!!not_base64!!!");
      expect(result.valid).toBe(false);
    });
  });

  describe("isValidBase64", () => {
    it("should validate standard base64", () => {
      expect(isValidBase64("SGVsbG8=", false)).toBe(true);
    });

    it("should validate URL-safe base64", () => {
      expect(isValidBase64("SGVsbG8", true)).toBe(true);
    });

    it("should reject invalid characters", () => {
      expect(isValidBase64("!!!invalid!!!", false)).toBe(false);
    });
  });
});
