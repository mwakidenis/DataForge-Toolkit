import { describe, it, expect } from "vitest";
import { parseColor, formatColorResult } from "../utils/color";

describe("Color Service", () => {
  it("should parse hex color", () => {
    const result = parseColor("#ff5733");
    expect(result.valid).toBe(true);
    expect(result.hex).toBe("#ff5733");
    expect(result.rgb).toEqual({ r: 255, g: 87, b: 51 });
  });

  it("should parse short hex", () => {
    const result = parseColor("#f00");
    expect(result.valid).toBe(true);
    expect(result.hex).toBe("#ff0000");
  });

  it("should parse RGB", () => {
    const result = parseColor("rgb(255, 87, 51)");
    expect(result.valid).toBe(true);
    expect(result.hex).toBe("#ff5733");
  });

  it("should parse HSL", () => {
    const result = parseColor("hsl(11, 100%, 60%)");
    expect(result.valid).toBe(true);
    expect(result.hsl.h).toBe(11);
  });

  it("should reject invalid", () => {
    const result = parseColor("not-a-color");
    expect(result.valid).toBe(false);
  });

  it("should format color result", () => {
    const result = formatColorResult("#ff5733");
    expect(result.valid).toBe(true);
    expect(result.hex).toBe("#ff5733");
    expect(result.rgb).toBe("rgb(255, 87, 51)");
    expect(result.hsl).toContain("hsl(");
  });
});
