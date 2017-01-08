const {deepEqual} = require("assert")
const shapes = require("../src/shapes")
const rotate = require("../src/rotate")

const toArray = (array) => array.reduce(
  (memo, item) => {
    memo[item.idx] = item.val
    return memo
  },
  []
)

describe("rotation", () => {
  it("rotates 90 - L (1)", () => {
    deepEqual(toArray(rotate(shapes.I.shape)), [
      1, 1, 1, 1,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ])
  })

  it("rotates 90 - L (2)", () => {
    deepEqual(toArray(rotate(rotate(shapes.I.shape))), [
      0, 0, 0, 1,
      0, 0, 0, 1,
      0, 0, 0, 1,
      0, 0, 0, 1,
    ])
  })

  it("rotates 90 - L (3)", () => {
    deepEqual(toArray(rotate(rotate(rotate(shapes.I.shape)))), [
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      1, 1, 1, 1,
    ])
  })

  it("rotates 90 - L (4)", () => {
    deepEqual(
      rotate(rotate(rotate(rotate(shapes.I.shape)))),
      shapes.I.shape
    )
  })

  it("rotates square", () => {
    const square = shapes.O.shape
    deepEqual(toArray(rotate(square)), toArray(square))
  })

  it("rotates T", () => {
    const T = shapes.T.shape
    deepEqual(toArray(rotate(T)), [
      0, 1, 0,
      1, 1, 0,
      0, 1, 0,
    ])
  })
})
