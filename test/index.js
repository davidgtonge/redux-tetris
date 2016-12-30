const {reducer, moveLeft, moveRight, moveDown, addBlock} = require("../src/tetris")
const {ok, equal, deepEqual}  = require("assert")

const getState = () => {
  const initialState = reducer(undefined, {type: null})
  return addBlock(initialState)
}

describe("reducer", () => {
  it("initialState is used", () => {
    const initialState = reducer(undefined, {type: null})
    deepEqual(Object.keys(initialState), [
      "board", "counter", "gamespeed", "score", "block", "paused",
    ])
  })

  it("add block", () => {
    const initialState = reducer(undefined, {type: null})
    const state = addBlock(initialState)
    deepEqual(Object.keys(state.block), [
      "color", "shape", "x", "y",
    ])
  })

  it("move left", () => {
    const initialState = getState()
    const state = reducer(initialState, moveLeft())
    equal(initialState.block.x - 1, state.block.x)
  })

  it("move right", () => {
    const initialState = getState()
    const state = reducer(initialState, moveRight())
    equal(initialState.block.x + 1, state.block.x)
  })

  it("move down", () => {
    const initialState = getState()
    const state = reducer(initialState, moveDown())
    equal(initialState.block.y + 1, state.block.y)
  })
})
