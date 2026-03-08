# Redux Tetris

> Historical project, modernised. Originally a 2016 experiment in point-free Redux reducers with Ramda; rewritten in TypeScript with Vite while keeping the same compositional game logic.

**Live demo:** https://davidgtonge.github.io/redux-tetris/

Wasm reimplementation: [rust-tetris](https://github.com/davidgtonge/rust-tetris)

## What this demonstrates

- Composing Redux reducers from small, reusable Ramda transforms
- Guarding invalid moves without nested conditionals
- Separating game rules from rendering
- Functional composition over imperative state machines
- TypeScript types layered onto a point-free style without flattening it

## The reducer

The game loop is still a declarative pipeline:

```typescript
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
```

## Development

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # game-logic tests
npm run test:coverage
npm run build
```

## Stack

- React 19 + Redux 5 + Ramda 0.32
- TypeScript 6 + Vite 8
- Vitest 4

## License

MIT
