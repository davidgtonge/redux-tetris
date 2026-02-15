/** @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest";
import { ActionType } from "../src/tetris/types.ts";
import { setupKeys } from "../src/tetris/keys.ts";

describe("setupKeys", () => {
  it("dispatches movement actions for arrow keys", () => {
    const dispatch = vi.fn();
    const remove = setupKeys(dispatch);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(dispatch.mock.calls.map(([action]) => action.type)).toEqual([
      ActionType.LEFT,
      ActionType.RIGHT,
      ActionType.ROTATE,
      ActionType.DOWN,
    ]);

    remove();
  });

  it("ignores unrelated keys", () => {
    const dispatch = vi.fn();
    const remove = setupKeys(dispatch);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(dispatch).not.toHaveBeenCalled();

    remove();
  });
});
