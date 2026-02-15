import { describe, expect, it } from "vitest";
import rotate from "../src/tetris/rotate.ts";
import shapes from "../src/tetris/shapes.ts";
import type { ShapeCell } from "../src/tetris/types.ts";

const toArray = (cells: ShapeCell[]) =>
  cells.reduce<number[]>((memo, item) => {
    memo[item.idx] = item.val;
    return memo;
  }, []);

describe("rotation", () => {
  it("rotates I 90° once", () => {
    expect(toArray(rotate(shapes.I.shape))).toEqual([
      1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it("rotates I 90° twice", () => {
    expect(toArray(rotate(rotate(shapes.I.shape)))).toEqual([
      0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
    ]);
  });

  it("rotates I 90° three times", () => {
    expect(toArray(rotate(rotate(rotate(shapes.I.shape))))).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
    ]);
  });

  it("rotates I back to start after four turns", () => {
    expect(
      rotate(rotate(rotate(rotate(shapes.I.shape)))),
    ).toEqual(shapes.I.shape);
  });

  it("leaves O unchanged", () => {
    const square = shapes.O.shape;
    expect(toArray(rotate(square))).toEqual(toArray(square));
  });

  it("rotates T", () => {
    expect(toArray(rotate(shapes.T.shape))).toEqual([0, 1, 0, 1, 1, 0, 0, 1, 0]);
  });
});
