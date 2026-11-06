import { describe, it, expect } from "vitest";
import { decodeJwt, isValidJwtFormat } from "../utils/jwt";

describe("JWT Service", () => {
  const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.THISISNOTREALSIG";

  describe("isValidJwtFormat", () => {
    it("should validate a proper JWT", () => {
      expect(isValidJwtFormat(validToken)).toBe(true);
    });

    it("should reject invalid format", () => {
      expect(isValidJwtFormat("not.a.jwt")).toBe(false);
      expect(isValidJwtFormat("a.b")).toBe(false);
      expect(isValidJwtFormat("a.b.c.d")).toBe(false);
    });
  });

  describe("decodeJwt", () => {
    it("should decode header and payload", () => {
      const result = decodeJwt(validToken);
      expect(result.valid).toBe(true);
      expect(result.header.alg).toBe("HS256");
      expect(result.header.typ).toBe("JWT");
      expect(result.payload.sub).toBe("1234567890");
      expect(result.payload.name).toBe("John Doe");
      expect(result.payload.admin).toBe(true);
    });

    it("should return invalid for bad token", () => {
      const result = decodeJwt("not.a.valid.token");
      expect(result.valid).toBe(false);
    });
  });
});
