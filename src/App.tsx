import * as R from "ramda";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  mergeBoardAndBlock,
  moveDown,
  moveLeft,
  moveRight,
  pause,
  restart,
  resume,
  rotate,
} from "./tetris/tetris.ts";
import type { GameState } from "./tetris/types.ts";
import { BOARD_WIDTH } from "./tetris/constants.ts";

const CELL_SIZE = 20;

function cellColor(cell: number | string): string {
  if (!cell) return "var(--cell-empty)";
  return String(cell);
}

function BoardView({ rows }: { rows: (number | string)[][] }) {
  return (
    <div className="board" role="grid" aria-label="Tetris board">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row" role="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className="cell"
              role="gridcell"
              style={{
                background: cellColor(cell),
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const state = useSelector((s: GameState) => s);
  const { score, gameover, paused } = state;

  const displayRows = useMemo(
    () => R.splitEvery(BOARD_WIDTH, mergeBoardAndBlock(state)),
    [state],
  );

  return (
    <main className="app">
      <header>
        <h1>Redux Tetris</h1>
        <p className="lede">
          React, Redux, Ramda, and TypeScript — point-free reducer composition.
        </p>
      </header>

      <section className={`playfield${gameover ? " gameover" : ""}`}>
        <BoardView rows={displayRows} />
      </section>

      <p className="score" aria-live="polite">
        Score: {score}
        {gameover ? " — game over" : paused ? " — paused" : ""}
      </p>

      <div className="controls">
        <div className="button-row" role="group" aria-label="Movement">
          <button type="button" onClick={() => dispatch(rotate())}>
            Rotate
          </button>
          <button type="button" onClick={() => dispatch(moveLeft())}>
            Left
          </button>
          <button type="button" onClick={() => dispatch(moveRight())}>
            Right
          </button>
          <button type="button" onClick={() => dispatch(moveDown())}>
            Down
          </button>
        </div>
        <div className="button-row" role="group" aria-label="Game">
          <button type="button" onClick={() => dispatch(pause())}>
            Pause
          </button>
          <button type="button" onClick={() => dispatch(resume())}>
            Resume
          </button>
          <button type="button" onClick={() => dispatch(restart())}>
            Restart
          </button>
        </div>
      </div>

      <p className="hint">Arrow keys also work.</p>
    </main>
  );
}
