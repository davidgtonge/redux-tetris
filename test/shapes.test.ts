import { describe, expect, it } from "vitest";
import shapes, { type ShapeName } from "../src/tetris/shapes.ts";

const shapeNames: ShapeName[] = ["I", "J", "L", "O", "S", "T", "Z"];

describe("shapes", () => {
  it("defines all standard tetrominoes", () => {
    expect(Object.keys(shapes).sort()).toEqual(shapeNames.sort());
  });

  it.each(shapeNames)("%s has square matrix cells with color", (name) => {
    const piece = shapes[name];
    const size = Math.sqrt(piece.shape.length);
    expect(Number.isInteger(size)).toBe(true);
    expect(piece.shape).toHaveLength(size * size);
    expect(piece.color).toBeTruthy();
    expect(piece.shape.every((cell) => typeof cell.val === "number")).toBe(
      true,
    );
  });
});
