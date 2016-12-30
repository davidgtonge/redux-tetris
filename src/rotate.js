const R = require("ramda")

const reducer = R.curry((size, memo, item, idx) => {
  const row = Math.floor(idx / size)
  const col = idx - (row * size)
  const newIdx = (size - 1 - row) + (col * size)
  memo[newIdx] = item
  return memo
})

module.exports = (array) => array.reduce(reducer(Math.sqrt(array.length)), [])
