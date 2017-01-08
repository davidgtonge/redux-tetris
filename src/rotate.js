const R = require("ramda")

const mapFn = R.curry((size, {val, idx}) => {
  const row = Math.floor(idx / size)
  const col = idx - (row * size)
  const newIdx = (size - 1 - row) + (col * size)
  return {val, idx: newIdx}
})

const rotate = (array) => R.map(mapFn(Math.sqrt(array.length)), array)

module.exports = rotate
