import { describe, it, expect } from "vitest";
import { hashString } from "../utils/hash";

describe("Hash Service", () => {
  const known = {
    md5: "71d9d67736eccdd0bae06192931f2af3",
    sha1: "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d",
    sha256: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  };

  it("should compute MD5", async () => {
    const result = await hashString("hello", "md5");
    expect(result.hash).toBe(known.md5);
    expect(result.algorithm).toBe("md5");
  });

  it("should compute SHA-1", async () => {
    const result = await hashString("hello", "sha1");
    expect(result.hash).toBe(known.sha1);
    expect(result.algorithm).toBe("sha1");
  });

  it("should compute SHA-256", async () => {
    const result = await hashString("hello", "sha256");
    expect(result.hash).toBe(known.sha256);
    expect(result.algorithm).toBe("sha256");
  });

  it("should compute SHA-512", async () => {
    const result = await hashString("hello", "sha512");
    expect(result.hash.length).toBe(128);
    expect(result.algorithm).toBe("sha512");
  });

  it("should handle empty string", async () => {
    const result = await hashString("", "sha256");
    expect(result.hash).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });
});
