import { describe, expect, it, vi } from "vitest";
import { BOARD_WIDTH } from "../src/tetris/constants.ts";
import type { Block } from "../src/tetris/types.ts";
import {
  addBlock,
  createBlock,
  emptyBlock,
  initialState,
  mergeBoardAndBlock,
  moveDown,
  moveLeft,
  moveRight,
  pause,
  reducer,
  restart,
  resume,
  rotate,
  tick,
  withBlock,
} from "../src/tetris/tetris.ts";

const noop = { type: "NOOP" as const, payload: {} };

function toGrid(block: Block): number[] {
  const size = Math.sqrt(block.shape.length);
  const grid = Array.from({ length: size * size }, () => 0);
  for (const { val, idx } of block.shape) {
    grid[idx] = val;
  }
  return grid;
}

describe("reducer", () => {
  it("uses initial state", () => {
    const state = reducer(undefined, noop as never);
    expect(Object.keys(state).sort()).toEqual([
      "block",
      "board",
      "counter",
      "gameover",
      "gamespeed",
      "paused",
      "score",
    ]);
    expect(state.board).toHaveLength(BOARD_WIDTH * 20);
    expect(state.block).toEqual(emptyBlock);
  });

  it("moves left when valid", () => {
    const initial = withBlock(initialState, "I");
    const state = reducer(initial, moveLeft());
    expect(state.block.x).toBe(initial.block.x - 1);
  });

  it("moves right when valid", () => {
    const initial = withBlock(initialState, "I");
    const state = reducer(initial, moveRight());
    expect(state.block.x).toBe(initial.block.x + 1);
  });

  it("moves down when valid", () => {
    const initial = withBlock(initialState, "I");
    const state = reducer(initial, moveDown());
    expect(state.block.y).toBe(initial.block.y + 1);
  });

  it("rejects left move at the wall", () => {
    const initial = withBlock(initialState, "O", 0);
    const state = reducer(initial, moveLeft());
    expect(state).toBe(initial);
    expect(state.block.x).toBe(0);
  });

  it("rejects right move at the wall", () => {
    const initial = withBlock(initialState, "I", BOARD_WIDTH - 1);
    const state = reducer(initial, moveRight());
    expect(state).toBe(initial);
  });

  it("rotates when valid", () => {
    const initial = withBlock(initialState, "L");
    const state = reducer(initial, rotate());
    expect(toGrid(state.block)).not.toEqual(toGrid(initial.block));
    expect(state.block.x).toBe(initial.block.x);
  });

  it("pauses and resumes", () => {
    const paused = reducer(initialState, pause());
    expect(paused.paused).toBe(true);

    const resumed = reducer(paused, resume());
    expect(resumed.paused).toBe(false);
  });

  it("restarts to initial state", () => {
    const playing = withBlock(
      { ...initialState, score: 99, paused: true, gameover: true },
      "Z",
    );
    const state = reducer(playing, restart());
    expect(state).toEqual(initialState);
  });

  it("ignores unknown actions", () => {
    const state = withBlock(initialState, "I");
    expect(reducer(state, noop as never)).toBe(state);
  });
});

describe("mergeBoardAndBlock", () => {
  it("writes active block cells onto the board", () => {
    const state = withBlock(initialState, "O", 2, 3);
    const board = mergeBoardAndBlock(state);
    const filled = board.filter((cell) => cell === "yellow");
    expect(filled).toHaveLength(4);
  });

  it("leaves board unchanged for an empty block", () => {
    expect(mergeBoardAndBlock(initialState)).toEqual(initialState.board);
  });
});

describe("addBlock", () => {
  it("places a random shape on the board", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const state = addBlock(initialState);
    expect(state.block.color).toBe("cyan");
    expect(state.block.shape.length).toBeGreaterThan(0);
    vi.mocked(Math.random).mockRestore();
  });
});

describe("createBlock", () => {
  it("centers shapes by default", () => {
    const block = createBlock("I");
    expect(block.x).toBe(4);
    expect(block.y).toBe(0);
    expect(block.color).toBe("cyan");
  });

  it("accepts explicit coordinates", () => {
    const block = createBlock("T", 1, 5);
    expect(block.x).toBe(1);
    expect(block.y).toBe(5);
  });
});

describe("tick pipeline", () => {
  it("increments counter each tick", () => {
    const state = reducer(initialState, tick());
    expect(state.counter).toBe(1);
  });

  it("does not increment counter while paused", () => {
    const paused = reducer(initialState, pause());
    const state = reducer(paused, tick());
    expect(state.counter).toBe(0);
  });

  it("merges a landed block on gamespeed boundary", () => {
    const state = withBlock(
      { ...initialState, counter: 11, gamespeed: 12 },
      "O",
      5,
      18,
    );
    const next = reducer(state, tick());
    expect(next.board.some((cell) => cell === "yellow")).toBe(true);
    expect(next.block.shape.length).toBeGreaterThan(0);
    expect(next.block.color).not.toBe("");
  });

  it("declares game over when spawn is blocked", () => {
    const blockedBoard = [...initialState.board];
    blockedBoard[BOARD_WIDTH + 4] = "gray";
    blockedBoard[BOARD_WIDTH + 5] = "gray";
    const state = {
      ...initialState,
      board: blockedBoard,
      counter: 11,
      gamespeed: 12,
      block: createBlock("O", 4, 0),
    };
    const next = reducer(state, tick());
    expect(next.gameover).toBe(true);
    expect(next.paused).toBe(true);
  });

  it("clears highlighted rows and increases score", () => {
    const row = Array.from({ length: BOARD_WIDTH }, () => "white" as const);
    const board = [
      ...Array.from({ length: BOARD_WIDTH * 19 }, () => 0),
      ...row,
    ];
    const state = {
      ...initialState,
      board,
      counter: 11,
      gamespeed: 12,
    };
    const next = reducer(state, tick());
    expect(next.board.filter((cell) => cell === 0).length).toBe(
      BOARD_WIDTH * 20,
    );
    expect(next.score).toBe(26); // 25 row clear + 1 gamespeed score tick
  });
});
