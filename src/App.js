import React from "react"
import { connect } from "react-redux"
import R from "ramda"
import {mergeBoardAndBlock, rotate, moveLeft, moveRight, moveDown, pause, resume, restart} from "./tetris"
import {Grid, Row, Col, PageHeader, Alert, Button, ButtonGroup} from "react-bootstrap"

const SIZE = 20

const squareStyle = (color) => {
  return {
    background: color,
    "border-right": "1px solid rgba(0,0,0,0.1)",
    width: SIZE,
    height: SIZE,
    display: "inline-block",
  }
}

const square = (elem, idx) => {
  const color = elem || "rgb(200,200,200)"
  return (
    <div key={idx} style={squareStyle(color)} />
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
    <Grid>
      <Row>
        <Col xs={0} md={3} />
        <Col xs={12} md={6}>
          <PageHeader>Redux Tetris</PageHeader>
          <div style={{opacity: props.gameover ? 0.4 : 1, width: 242, margin: "0 auto", border: "1px solid #9954bb"}}>
          {props.board.map(row)}
          </div>
          <hr />
           <Alert bsStyle="info">
           Score: {props.score} {props.gameover ? " - GAME OVER!!!" : ""}
           </Alert>
           <ButtonGroup>
             <Button bsStyle="primary" onClick={props.rotate}>Rotate</Button>
             <Button onClick={props.moveLeft}>Left</Button>
             <Button bsStyle="primary" onClick={props.moveRight}>Right</Button>
             <Button onClick={props.moveDown}>Down</Button>
           </ButtonGroup>
           <span> - </span>
           <ButtonGroup>
             <Button bsStyle="warning" onClick={props.pause}>Pause</Button>
             <Button bsStyle="success" onClick={props.resume}>Resume</Button>
             <Button bsStyle="danger" onClick={props.restart}>Restart</Button>
           </ButtonGroup>
        </Col>
        <Col xs={0} md={3} />
      </Row>
    </Grid>
  )
}

const mapStateToProps = (state) => {
  return {
    board: R.splitEvery(12, mergeBoardAndBlock(state)),
    counter: state.counter,
    score: state.score,
    gameover: state.gameover,
  }
}

const actionMap = {rotate, moveLeft, moveRight, moveDown, pause, resume, restart}

export default connect(mapStateToProps, actionMap)(App)
