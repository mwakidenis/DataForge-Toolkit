import { describe, it, expect } from "vitest";
import {
  safeParseJson,
  deepGet,
  deepSet,
  deepCloneJson,
  pickOmitKeys,
  validateJsonStructure,
  queryPath,
  type JsonObject,
} from "../services/jsonService";

describe("JSON Service", () => {
  const sampleObj = { user: { name: "Ada", age: 36, tags: ["math", "computing"] } };

  describe("safeParseJson", () => {
    it("should parse valid JSON", () => {
      const result = safeParseJson('{"key": "value"}');
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.data).toEqual({ key: "value" });
    });

    it("should return error for invalid JSON", () => {
      const result = safeParseJson("{invalid}");
      expect(result.ok).toBe(false);
    });

    it("should return error for empty input", () => {
      const result = safeParseJson("");
      expect(result.ok).toBe(false);
    });
  });

  describe("deepGet", () => {
    it("should get nested value by path", () => {
      const result = deepGet(sampleObj, "user.name");
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.data).toBe("Ada");
    });

    it("should return error for non-existent path", () => {
      const result = deepGet(sampleObj, "user.nonexistent");
      expect(result.ok).toBe(false);
    });
  });

  describe("deepSet", () => {
    it("should set nested value by path", () => {
      const result = deepSet(sampleObj, "user.name", "Grace");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect((result.data.user as JsonObject).name).toBe("Grace");
        // Original should be unchanged
        expect(sampleObj.user.name).toBe("Ada");
      }
    });
  });

  describe("deepCloneJson", () => {
    it("should deep clone an object", () => {
      const clone = deepCloneJson(sampleObj);
      expect(clone).toEqual(sampleObj);
      expect(clone).not.toBe(sampleObj);
      if (clone && typeof clone === "object" && !Array.isArray(clone)) {
        expect((clone as any).user).not.toBe((sampleObj as any).user);
      }
    });
  });

  describe("pickOmitKeys", () => {
    it("should pick specified keys", () => {
      const result = pickOmitKeys(sampleObj as any, ["user"], []);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.picked).toHaveProperty("user");
      }
    });

    it("should omit specified keys", () => {
      const result = pickOmitKeys(sampleObj as any, [], ["user"]);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.omitted).not.toHaveProperty("user");
      }
    });
  });

  describe("validateJsonStructure", () => {
    it("should validate non-empty object", () => {
      const result = validateJsonStructure(sampleObj);
      expect(result.valid).toBe(true);
    });

    it("should reject null", () => {
      const result = validateJsonStructure(null);
      expect(result.valid).toBe(false);
    });
  });

  describe("queryPath", () => {
    it("should query existing path", () => {
      const result = queryPath(sampleObj, "user.name");
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.data).toBe("Ada");
    });

    it("should return error for missing path", () => {
      const result = queryPath(sampleObj, "user.missing");
      expect(result.ok).toBe(false);
    });
  });
});
