const {deepEqual} = require("assert")
const shapes = require("../src/shapes")
const rotate = require("../src/rotate")

describe("rotation", () => {
  it("rotates 90 - L (1)", () => {
    deepEqual(rotate(shapes.I.shape), [
      1, 1, 1, 1,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ])
  })

  it("rotates 90 - L (2)", () => {
    deepEqual(rotate(rotate(shapes.I.shape)), [
      0, 0, 0, 1,
      0, 0, 0, 1,
      0, 0, 0, 1,
      0, 0, 0, 1,
    ])
  })

  it("rotates 90 - L (3)", () => {
    deepEqual(rotate(rotate(rotate(shapes.I.shape))), [
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
    const square = [
      1, 1,
      1, 1,
    ]
    deepEqual(rotate(square), square)
  })

  it("rotates T", () => {
    const T = [
      0, 0, 0,
      1, 1, 1,
      0, 1, 0,
    ]
    deepEqual(rotate(T), [
      0, 1, 0,
      1, 1, 0,
      0, 1, 0,
    ])
  })
})
