import type { Dispatch } from "redux";
import { moveDown, moveLeft, moveRight, rotate } from "./tetris.ts";
import type { GameAction } from "./types.ts";

type ActionCreator = () => GameAction;

const keyMap: Record<string, ActionCreator> = {
  ArrowUp: rotate,
  ArrowDown: moveDown,
  ArrowLeft: moveLeft,
  ArrowRight: moveRight,
};

export function setupKeys(dispatch: Dispatch<GameAction>): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    const action = keyMap[event.key];
    if (!action) return;
    event.preventDefault();
    dispatch(action());
  };

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}
