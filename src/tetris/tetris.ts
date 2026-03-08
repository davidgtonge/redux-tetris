// Ramda's point-free combinators are the point of this module; keep types at the boundaries.
// @ts-nocheck
import * as R from "ramda";
import rotateBlock from "./rotate.ts";
import shapes, { type ShapeName } from "./shapes.ts";
import { BOARD_HEIGHT, BOARD_WIDTH, HIGHLIGHT_COLOUR } from "./constants.ts";
import {
  ActionType,
  type Block,
  type Board,
  type GameAction,
  type GameState,
  type ReducerHandler,
  type ReducerSpec,
  type ShapeCell,
} from "./types.ts";

const shapesArray = R.values(shapes);

export const createBlock = (
  shapeName: ShapeName,
  x?: number,
  y = 0,
): Block => {
  const template = shapes[shapeName];
  const block = R.clone(template) as Block;
  const size = Math.sqrt(block.shape.length);
  block.x = x ?? Math.round((BOARD_WIDTH - size) / 2);
  block.y = y;
  return block;
};

const randomShape = (): Block => {
  const index = Math.floor(Math.random() * shapesArray.length);
  const shapeName = (["I", "J", "L", "O", "S", "T", "Z"] as const)[index]!;
  return createBlock(shapeName);
};

export const withBlock = (
  state: GameState,
  shapeName: ShapeName,
  x?: number,
  y = 0,
): GameState => R.mergeRight(state, { block: createBlock(shapeName, x, y) });

const createAction = (type: ActionType) => (): GameAction => ({ type, payload: {} });

export const emptyBlock: Block = {
  shape: [],
  color: "",
  x: 0,
  y: 0,
};

export const initialState: GameState = {
  board: R.repeat(0, BOARD_WIDTH * BOARD_HEIGHT),
  counter: 0,
  gamespeed: 12,
  score: 0,
  block: emptyBlock,
  paused: false,
  gameover: false,
};

export const tick = createAction(ActionType.TICK);
export const moveLeft = createAction(ActionType.LEFT);
export const moveRight = createAction(ActionType.RIGHT);
export const rotate = createAction(ActionType.ROTATE);
export const moveDown = createAction(ActionType.DOWN);
export const pause = createAction(ActionType.PAUSE);
export const resume = createAction(ActionType.RESUME);
export const restart = createAction(ActionType.RESTART);

type Position = { row: number; col: number; newIdx: number };

const getPosition = R.curry(
  (size: number, x: number, y: number, idx: number): Position => {
    const _row = Math.floor(idx / size);
    const row = y + _row;
    const col = x + idx - _row * size;
    const newIdx = row * BOARD_WIDTH + col;
    return { row, col, newIdx };
  },
);

const validityReducer = R.curry(
  (
    size: number,
    board: Board,
    block: Block,
    memo: boolean,
    { val, idx }: ShapeCell,
  ): boolean => {
    if (!memo || !val) return memo;
    const { col, newIdx } = getPosition(size, block.x, block.y, idx);
    if (col < 0) return false;
    if (col >= BOARD_WIDTH) return false;
    return board[newIdx] === 0;
  },
);

const isValid = (board: Board, block: Block): boolean => {
  const size = Math.sqrt(block.shape.length);
  return R.reduce(validityReducer(size, board, block), true, block.shape);
};

const markRow = R.unless(
  R.includes(0),
  R.always(R.repeat(HIGHLIGHT_COLOUR, BOARD_WIDTH)),
);

const counterLens = R.lensProp<GameState, "counter">("counter");
const scoreLens = R.lensProp<GameState, "score">("score");
const blockXLens = R.lensPath<GameState, number>(["block", "x"]);
const blockYLens = R.lensPath<GameState, number>(["block", "y"]);
const blockShapeLens = R.lensPath<GameState, ShapeCell[]>(["block", "shape"]);
const boardLens = R.lensProp<GameState, "board">("board");
const blockLens = R.lensProp<GameState, "block">("block");

const incrementGameCounter = R.over(counterLens, R.add(1));
const handleMoveLeft = R.over(blockXLens, R.add(-1));
const handleMoveRight = R.over(blockXLens, R.add(1));
const handleMoveDown = R.over(blockYLens, R.add(1));
const handleRotate = R.over(blockShapeLens, rotateBlock);
const handlePause = R.assoc("paused", true);
const handleResume = R.assoc("paused", false);
const handleRestart = R.always(initialState);
const incrementScore = R.over(scoreLens, R.add(1));
export const addBlock = R.over(blockLens, randomShape);

const markRows = R.over(
  boardLens,
  R.compose(R.flatten, R.map(markRow), R.splitEvery(BOARD_WIDTH)),
);

const reversedUpdate = R.curry((color: string, board: Board, idx: number) =>
  R.update(idx, color, board),
);

export const mergeBoardAndBlock = ({ board, block }: GameState): Board => {
  const size = Math.sqrt(block.shape.length);
  return R.compose(
    R.reduce(reversedUpdate(block.color), board),
    R.pluck("newIdx"),
    R.map(getPosition(size, block.x, block.y)),
    R.pluck("idx"),
    R.reject(R.propEq(0, "val")),
  )(block.shape);
};

const guardState =
  (fn: (state: GameState) => GameState) =>
  (state: GameState): GameState => {
    const newState = fn(state);
    if (isValid(newState.board, newState.block)) {
      return newState;
    }
    return state;
  };

const moveBlocks = (state: GameState): GameState => {
  const newState = handleMoveDown(state);

  if (isValid(newState.board, newState.block)) {
    return newState;
  }

  if (state.block.y === 0) {
    return R.mergeRight(state, { paused: true, gameover: true });
  }

  const board = mergeBoardAndBlock(state);
  return R.mergeRight(state, { board, block: emptyBlock });
};

const clearRows = (state: GameState): GameState => {
  const rows = R.splitEvery(BOARD_WIDTH, state.board);
  const updatedRows = R.reject(R.includes(HIGHLIGHT_COLOUR), rows);
  const newRowsRequired = rows.length - updatedRows.length;
  if (!newRowsRequired) {
    return state;
  }

  const board = R.compose(
    R.concat(R.repeat(0, newRowsRequired * BOARD_WIDTH)),
    R.flatten,
  )(updatedRows);

  const score = state.score + 25 ** newRowsRequired;
  return R.mergeRight(state, { board, score });
};

const skipIfEmptyBlock = R.ifElse(R.propEq(emptyBlock, "block"), R.identity);

const runIfEmptyBlock = R.ifElse(R.propEq(emptyBlock, "block"), R.__, R.identity);

const skipOnPaused = (handler: ReducerHandler): ReducerHandler => (state, action) =>
  state.paused ? state : handler(state, action);

const slow =
  (handler: ReducerHandler): ReducerHandler =>
  (state) =>
    R.cond([
      [R.propEq(true, "paused"), R.identity],
      [(s: GameState) => s.counter % s.gamespeed === 0, handler],
      [R.T, R.identity],
    ])(state);

const createReducer = (start: GameState, spec: ReducerSpec) => {
  return (state: GameState = start, action: GameAction): GameState =>
    R.cond([
      [
        R.is(Array),
        (handlers: ReducerHandler[]) =>
          R.reduce(
            (current, handler) => handler(current, action),
            state,
            handlers,
          ),
      ],
      [R.is(Function), (handler: ReducerHandler) => handler(state, action)],
      [R.T, R.always(state)],
    ])(spec[action.type]);
};

export const reducer = createReducer(initialState, {
  [ActionType.LEFT]: guardState(handleMoveLeft),
  [ActionType.RIGHT]: guardState(handleMoveRight),
  [ActionType.DOWN]: guardState(handleMoveDown),
  [ActionType.ROTATE]: guardState(handleRotate),
  [ActionType.PAUSE]: handlePause,
  [ActionType.RESUME]: handleResume,
  [ActionType.RESTART]: handleRestart,
  [ActionType.TICK]: [
    skipOnPaused(incrementGameCounter),
    slow(skipIfEmptyBlock(moveBlocks)),
    slow(clearRows),
    slow(markRows),
    slow(runIfEmptyBlock(addBlock)),
    slow(incrementScore),
  ],
});
