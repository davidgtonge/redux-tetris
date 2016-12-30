import R from "ramda"
import random from "lodash.random"
import rotateBlock from "./rotate"
import shapes from "./shapes"

const BOARD_WIDTH = 12
const BOARD_HEIGHT = 20

const TICK = "TICK"
const LEFT = "LEFT"
const RIGHT = "RIGHT"
const DOWN = "DOWN"
const ROTATE = "ROTATE"
const PAUSE = "PAUSE"
const RESUME = "RESUME"

const shapesArray = R.values(shapes)
const randomShape = () => R.clone(shapesArray[random(0, shapesArray.length - 1)])
// const randomShape = () => R.clone(shapes.I)

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
  gamespeed: 0.1,
  score: 0,
  block: emptyBlock,
  paused: false,
}

// Actions
export const tick = createAction(TICK)
export const moveLeft = createAction(LEFT)
export const moveRight = createAction(RIGHT)
export const rotate = createAction(ROTATE)
export const moveDown = createAction(DOWN)
export const pause = createAction(PAUSE)
export const resume = createAction(RESUME)

const incrementGameCounter = (state) => {
  if(state.paused) return state
  return R.assoc("counter", state.counter + state.gamespeed, state)
}

const handleMoveLeft = (state) => {
  const x = state.block.x - 1
  return R.assocPath(["block", "x"], x, state)
}

const handleMoveRight = (state) => {
  const x = state.block.x + 1
  return R.assocPath(["block", "x"], x, state)
}

const handleMoveDown = (state) => {
  const y = state.block.y + 1
  return R.assocPath(["block", "y"], y, state)
}

const handleRotate = (state) => {
  const shape = rotateBlock(state.block.shape)
  return R.assocPath(["block", "shape"], shape, state)
}

const isValid = (board, block) => {
  const size = Math.sqrt(block.shape.length)
  const reducer = (memo, item, idx) => {
    if(!memo || !item) return memo
    const row = block.y + Math.floor(idx / size)
    const col = block.x + idx - (Math.floor(idx / size) * size)
    if(col < 0) return false
    if(col >= BOARD_WIDTH) return false
    // todo: protect against boundaries
    const newIdx = (row * BOARD_WIDTH) + col
    return board[newIdx] === 0
  }
  return block.shape.reduce(reducer, true)
}

export const mergeBoardAndBlock = ({board, block}) => {
  const newBoard = R.clone(board)
  const size = Math.sqrt(block.shape.length)
  block.shape.forEach((item, idx) => {
    if (item) {
      const row = block.y + Math.floor(idx / size)
      const col = block.x + idx - (Math.floor(idx / size) * size)
      // console.log({row, col})
      const newIdx = (row * BOARD_WIDTH) + col
      newBoard[newIdx] = block.color
    }
  })
  return newBoard
}

const guardState = R.curry((fn, state) => {
  const newState = fn(state)
  if(isValid(newState.board, newState.block)) {
    return newState
  }
  return state
})

const moveBlocks = (state) => {
  // if(Math.round(state.counter) % 10 !== 0) {
  //   console.log("ticking....")
  //   return state
  // }
  if(state.block.shape.length === 0) {
    return state
  }
  const newState = handleMoveDown(state)
  // console.log(state.block, newState.block)
  if(isValid(newState.board, newState.block)) {
    return newState
  }
  const board = mergeBoardAndBlock(state)
  return R.merge(state, {board, block: emptyBlock})
}

const clearRows = (state) => {
  const rows = R.splitEvery(BOARD_WIDTH, state.board)
  const reducer = (memo, row) => {
    if (!R.contains("black", row)) {
      memo.unshift(row)
    }
    return memo
  }
  const updatedRows = R.reduceRight(reducer, [], rows)
  const newRowsRequired = rows.length - updatedRows.length
  // todo: use for score
  if(!newRowsRequired) {
    return state
  }
  const board = R.compose(
    R.concat(R.repeat(0, newRowsRequired * BOARD_WIDTH)),
    R.flatten,
  )(updatedRows)
  return R.assoc("board", board, state)
}

const markRow = (row) => {
  if (R.contains(0, row)) {
    return row
  }
  return R.repeat("black", BOARD_WIDTH)
}

const markRows = (state) => {
  const board = R.compose(
    R.flatten,
    R.map(markRow),
    R.splitEvery(BOARD_WIDTH)
  )(state.board)

  return R.assoc("board", board, state)
}

export const addBlock = (state) => {
  if (state.block !== emptyBlock) {
    return state
  }
  const block = randomShape()
  block.x = Math.round((BOARD_WIDTH - Math.sqrt(block.shape.length)) / 2)
  block.y = 0
  return R.assoc("block", block, state)
}

const handlePause = R.assoc("paused", true)
const handleResume = R.assoc("paused", false)

const slow = (handler) => {
  return (state) => {
    if(true) return handler(state)
  }
}

const createReducer = (initialState, spec) => {
  return (state = initialState, action) => {
    return R.cond([
      [R.is(Array), R.reduce(R.flip(R.call), state)],
      [R.is(Function), (fn) => fn(state)],
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
  [TICK]: [
    incrementGameCounter,
    slow(moveBlocks),
    slow(clearRows),
    markRows,
    slow(addBlock),
  ],
})
