import R from "ramda"

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

const toObjs = (array) => array.map((val, idx) => {
  return {val, idx}
})


const mapFn = R.over(R.lensProp("shape"), toObjs)

const shapes = {I, J, L, O, S, T, Z}

module.exports = R.map(mapFn, shapes)
