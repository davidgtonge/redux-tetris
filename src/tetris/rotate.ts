import type { ShapeCell } from "./types.ts";

const rotateCell = (size: number, { val, idx }: ShapeCell): ShapeCell => {
  const row = Math.floor(idx / size);
  const col = idx - row * size;
  const newIdx = size - 1 - row + col * size;
  return { val, idx: newIdx };
};

const rotate = (cells: ShapeCell[]): ShapeCell[] => {
  const size = Math.sqrt(cells.length);
  return cells.map((cell) => rotateCell(size, cell));
};

export default rotate;
