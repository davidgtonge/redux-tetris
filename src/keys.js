import key from "keymaster"
import {rotate, moveLeft, moveRight, moveDown} from "./tetris"


export default function setupKeys(dispatch) {
  const makeAction = (actionCreator) => {
    return () => {
      dispatch(actionCreator())
      return false
    }
  }

  key("up", makeAction(rotate))
  key("down", makeAction(moveDown))
  key("left", makeAction(moveLeft))
  key("right", makeAction(moveRight))
}
