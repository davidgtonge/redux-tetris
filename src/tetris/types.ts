export type Cell = number | string;

export type Board = Cell[];

export type ShapeCell = {
  val: number;
  idx: number;
};

export type Block = {
  color: string;
  shape: ShapeCell[];
  x: number;
  y: number;
};

export type GameState = {
  board: Board;
  counter: number;
  gamespeed: number;
  score: number;
  block: Block;
  paused: boolean;
  gameover: boolean;
};

export const ActionType = {
  TICK: "TICK",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  ROTATE: "ROTATE",
  PAUSE: "PAUSE",
  RESUME: "RESUME",
  RESTART: "RESTART",
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export type GameAction = {
  type: ActionType;
  payload: Record<string, never>;
};

export type ReducerHandler = (state: GameState, action: GameAction) => GameState;

export type ReducerSpec = Partial<
  Record<ActionType, ReducerHandler | ReducerHandler[]>
>;
