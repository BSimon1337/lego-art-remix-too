import { describe, expect, it } from "vitest";
import { loadAlgoFunctions } from "./load-algo";

const algo = loadAlgoFunctions();

describe("algo.js utility behavior", () => {
  it("converts RGB <-> hex values consistently", () => {
    expect(algo.hexToRgb("#abcdef")).toEqual([171, 205, 239]);
    expect(algo.rgbToHex(171, 205, 239)).toBe("#abcdef");
  });

  it("inverts hex colors", () => {
    expect(algo.inverseHex("#000000")).toBe("#ffffff");
    expect(algo.inverseHex("#ffffff")).toBe("#000000");
  });

  it("aligns pixels to nearest palette colors (golden)", () => {
    const pixels = [
      250, 10, 10, 255, // near red
      10, 240, 10, 255 // near green
    ];
    const palette = {
      "#ff0000": 100,
      "#00ff00": 100
    };
    const distance = (a, b) =>
      (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

    const aligned = algo.alignPixelsToStudMap(pixels, palette, distance);

    expect(aligned).toEqual([
      255, 0, 0, 255,
      0, 255, 0, 255
    ]);
  });

  it("discretizes depth pixels by thresholds", () => {
    const pixels = [
      10, 10, 10, 255,
      130, 130, 130, 255
    ];
    const thresholds = [64, 128, 192];
    const result = algo.getDiscreteDepthPixels(pixels, thresholds);

    expect(result).toEqual([
      0, 0, 0, 255,
      2, 2, 2, 255
    ]);
  });
});
