import React from "react"
import { connect } from "react-redux"
import R from "ramda"
import {mergeBoardAndBlock, rotate, moveLeft, moveRight, moveDown, pause, resume} from "./tetris"

const SIZE = 20

const square = (elem, idx) => {
  const color = elem || "rgb(200,200,200)"
  return (
    <div key={idx} style={{background: color, width: SIZE, height: SIZE, display: "inline-block"}} />
  )
}

const row = (elems, idx) => {
  return (
    <div key={idx} style={{margin: 0, padding: 0, height: SIZE}}>
      {elems.map(square)}
    </div>
  )
}

const App = (props) => {
  return (
    <div>
      <h1>Functional Tetris: {props.counter}</h1>
      <button onClick={props.rotate}>Rotate</button>
      <button onClick={props.moveLeft}>Left</button>
      <button onClick={props.moveRight}>Right</button>
      <button onClick={props.moveDown}>Down</button>
      <button onClick={props.pause}>Pause</button>
      <button onClick={props.resume}>Resume</button>
      {props.board.map(row)}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    board: R.splitEvery(12, mergeBoardAndBlock(state)),
    counter: state.counter,
  }
}

const actionMap = {rotate, moveLeft, moveRight, moveDown, pause, resume}

export default connect(mapStateToProps, actionMap)(App)
