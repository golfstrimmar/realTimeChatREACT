import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../src/scss/main.scss";
import store from "../src/redux/store";
import { Provider } from "react-redux";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
