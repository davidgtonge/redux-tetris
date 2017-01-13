# Redux Tetris

Available here: [https://tetris.davetonge.co.uk/](https://tetris.davetonge.co.uk/)

Tetris build with React, Redux & Ramda

Coded with a point-free functional style favouring composition, e.g.

```javascript
export const reducer = createReducer(initialState, {
  [LEFT]: guardState(handleMoveLeft),
  [RIGHT]: guardState(handleMoveRight),
  [DOWN]: guardState(handleMoveDown),
  [ROTATE]: guardState(handleRotate),
  [PAUSE]: handlePause,
  [RESUME]: handleResume,
  [RESTART]: handleRestart,
  [TICK]: [
    skipOnPaused(incrementGameCounter),
    slow(skipIfEmptyBlock(moveBlocks)),
    slow(clearRows),
    slow(markRows),
    slow(runIfEmptyBlock(addBlock)),
    slow(incrementScore),
  ],
})
```

The shape code is also fairly readable:

```javascript
const I = {
  color: "cyan",
  shape: [
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
  ],
}

const J = {
  color: "blue",
  shape: [
    0, 0, 0,
    1, 1, 1,
    0, 0, 1,
  ],
}

const L = {
  color: "orange",
  shape: [
    0, 0, 0,
    1, 1, 1,
    1, 0, 0,
  ],
}

const O = {
  color: "yellow",
  shape: [
    1, 1,
    1, 1,
  ],
}

const S = {
  color: "green",
  shape: [
    0, 0, 0,
    0, 1, 1,
    1, 1, 0,
  ],
}

const T = {
  color: "purple",
  shape: [
    0, 0, 0,
    1, 1, 1,
    0, 1, 0,
  ],
}

const Z = {
  color: "red",
  shape: [
    0, 0, 0,
    1, 1, 0,
    0, 1, 1,
  ],
}
```
