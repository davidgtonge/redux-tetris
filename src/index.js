import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import {reducer, tick} from "./tetris"
import App from "./App"
import { applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"
import promise from "redux-promise"
import createLogger from "redux-logger"
import setupKeys from "./keys"

const logger = createLogger({
  predicate: (getState, action) => action.type !== "TICK",
})
const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)
)

window.setInterval(() => {
  store.dispatch(tick())
}, 1000)

setupKeys(store.dispatch)



render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
)
