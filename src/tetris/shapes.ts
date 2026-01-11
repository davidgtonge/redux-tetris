import * as R from "ramda";
import type { Block } from "./types.ts";

type ShapeDef = {
  color: string;
  shape: number[];
};

const toCells = (matrix: number[]): Block["shape"] =>
  matrix.map((val, idx) => ({ val, idx }));

const withCells = (def: ShapeDef): Pick<Block, "color" | "shape"> => ({
  color: def.color,
  shape: toCells(def.shape),
});

const I: ShapeDef = {
  color: "cyan",
  shape: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
};

const J: ShapeDef = {
  color: "blue",
  shape: [0, 0, 0, 1, 1, 1, 0, 0, 1],
};

const L: ShapeDef = {
  color: "orange",
  shape: [0, 0, 0, 1, 1, 1, 1, 0, 0],
};

const O: ShapeDef = {
  color: "yellow",
  shape: [1, 1, 1, 1],
};

const S: ShapeDef = {
  color: "green",
  shape: [0, 0, 0, 0, 1, 1, 1, 1, 0],
};

const T: ShapeDef = {
  color: "purple",
  shape: [0, 0, 0, 1, 1, 1, 0, 1, 0],
};

const Z: ShapeDef = {
  color: "red",
  shape: [0, 0, 0, 1, 1, 0, 0, 1, 1],
};

const shapes = { I, J, L, O, S, T, Z };

export type ShapeName = keyof typeof shapes;

export default R.map(withCells, shapes) as Record<
  ShapeName,
  Pick<Block, "color" | "shape">
>;
