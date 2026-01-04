import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore } from "redux";
import App from "./App.tsx";
import { setupKeys } from "./tetris/keys.ts";
import { reducer, tick } from "./tetris/tetris.ts";
import "./styles.css";

const store = createStore(reducer);

setupKeys(store.dispatch);

window.setInterval(() => {
  store.dispatch(tick());
}, 1000 / 60);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
