import R from "ramda"
import random from "lodash.random"
import rotateBlock from "./rotate"
import shapes from "./shapes"

const BOARD_WIDTH = 12
const BOARD_HEIGHT = 20
const HIGHLIGHT_COLOUR = "white"

const TICK = "TICK"
const LEFT = "LEFT"
const RIGHT = "RIGHT"
const DOWN = "DOWN"
const ROTATE = "ROTATE"
const PAUSE = "PAUSE"
const RESUME = "RESUME"
const RESTART = "RESTART"

const shapesArray = R.values(shapes)
const randomShape = () => {
  const block = R.clone(shapesArray[random(0, shapesArray.length - 1)])
  block.x = Math.round((BOARD_WIDTH - Math.sqrt(block.shape.length)) / 2)
  block.y = 0
  return block
}

const createAction = (type) => {
  return () => {
    return {type, payload: {}}
  }
}

const emptyBlock =  {
  shape: [],
  color: "",
  x: 0,
  y: 0,
}

const initialState = {
  board: R.repeat(0, BOARD_WIDTH * BOARD_HEIGHT),
  counter: 0,
  gamespeed: 12, // slower is faster
  score: 0,
  block: emptyBlock,
  paused: false,
  gameover: false,
}

// Actions
export const tick = createAction(TICK)
export const moveLeft = createAction(LEFT)
export const moveRight = createAction(RIGHT)
export const rotate = createAction(ROTATE)
export const moveDown = createAction(DOWN)
export const pause = createAction(PAUSE)
export const resume = createAction(RESUME)
export const restart = createAction(RESTART)

// Helpers
const getPosition = R.curry((size, x, y, idx) => {
  const _row = Math.floor(idx / size)
  const row = y + _row
  const col = x + idx - (_row * size)
  const newIdx = (row * BOARD_WIDTH) + col
  return {row, col, newIdx}
})

const validityReducer = R.curry((size, board, block, memo, {val, idx}) => {
  if(!memo || !val) return memo
  const {col, newIdx} = getPosition(size, block.x, block.y, idx)
  if(col < 0) return false
  if(col >= BOARD_WIDTH) return false
  return board[newIdx] === 0
})

const isValid = (board, block) => {
  const size = Math.sqrt(block.shape.length)
  return R.reduce(validityReducer(size, board, block), true, block.shape)
}

const markRow = R.unless(
  R.contains(0),
  R.always(R.repeat(HIGHLIGHT_COLOUR, BOARD_WIDTH))
)

// Lenses
const counterLens = R.lensProp("counter")
const scoreLens = R.lensProp("score")
const blockXLens = R.lensPath(["block", "x"])
const blockYLens = R.lensPath(["block", "y"])
const blockShapeLens = R.lensPath(["block", "shape"])
const boardLens = R.lensProp("board")
const blockLens = R.lensProp("block")

// Basic Reducers
const incrementGameCounter = R.over(counterLens, R.add(1))
const handleMoveLeft = R.over(blockXLens, R.add(-1))
const handleMoveRight = R.over(blockXLens, R.add(1))
const handleMoveDown = R.over(blockYLens, R.add(1))
const handleRotate = R.over(blockShapeLens, rotateBlock)
const handlePause = R.assoc("paused", true)
const handleResume = R.assoc("paused", false)
const handleRestart = R.always(initialState)
const incrementScore = R.over(scoreLens, R.add(1))
export const addBlock = R.over(blockLens, randomShape)

const markRows = R.over(boardLens, R.compose(
  R.flatten,
  R.map(markRow),
  R.splitEvery(BOARD_WIDTH)
))

const reversedUpdate = R.curry((color, board, idx) => R.update(idx, color, board))

export const mergeBoardAndBlock = ({board, block}) => {
  return R.compose(
    R.reduce(reversedUpdate(block.color), board),
    R.pluck("newIdx"),
    R.map(getPosition(Math.sqrt(block.shape.length), block.x, block.y)),
    R.pluck("idx"),
    R.reject(R.propEq("val", 0))
  )(block.shape)
}

const guardState = R.curry((fn, state) => {
  const newState = fn(state)
  if(isValid(newState.board, newState.block)) {
    return newState
  }
  return state
})



const moveBlocks = (state) => {
  const newState = handleMoveDown(state)

  // Valid state - so return new state
  if(isValid(newState.board, newState.block)) {
    return newState
  }

  // Game Over - block stuck at 0
  if(state.block.y === 0) {
    return R.merge(state, {paused: true, gameover: true})
  }

  // Block can't move, but not game over - so merge block to board
  const board = mergeBoardAndBlock(state)
  return R.merge(state, {board, block: emptyBlock})
}

const clearRows = (state) => {
  const rows = R.splitEvery(BOARD_WIDTH, state.board)
  const updatedRows = R.reject(R.contains(HIGHLIGHT_COLOUR), rows)
  const newRowsRequired = rows.length - updatedRows.length
  if(!newRowsRequired) {
    return state
  }
  const board = R.compose(
    R.concat(R.repeat(0, newRowsRequired * BOARD_WIDTH)),
    R.flatten,
  )(updatedRows)

  const score = state.score + Math.pow(25, newRowsRequired)
  return R.merge(state, {board, score})
}


const skipIfEmptyBlock = R.ifElse(R.propEq("block", emptyBlock), R.identity)
const runIfEmptyBlock = R.ifElse(R.propEq("block", emptyBlock), R.__, R.identity)
const skipOnPaused = R.ifElse(R.propEq("paused", true), R.identity)

const slow = (handler) => R.cond([
  [R.propEq("paused", true), R.identity],
  [(s) => s.counter % s.gamespeed === 0, handler],
  [R.T, R.identity],
])

const createReducer = (initialState, spec) => {
  return (state = initialState, action) => {
    return R.cond([
      [R.is(Array), R.reduce((_state, fn) => fn(_state, action), state)],
      [R.is(Function), (fn) => fn(state, action)],
      [R.T, R.always(state)],
    ])(spec[action.type])
  }
}


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
