import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import authReducer from "./reducers/authReducer";
import socketReducer from "./reducers/socketReducer";
import onlineUsersReducer from "./reducers/onlineUsersReducer";
import AllUsersReducer from "./reducers/AllUsersReducer";
import messageReducer from "./reducers/messageReducer";
import errorReducer from "./reducers/errorReducer";
// =============================================
const localStorageAuthMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  if (state.auth.isAuthenticated && state.auth.user !== null) {
    localStorage.setItem("user", JSON.stringify(state.auth.user));
    localStorage.setItem("token", state.auth.token);
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return result;
};
// =============================================
// Создаем rootReducer
const rootReducer = combineReducers({
  auth: authReducer,
  socket: socketReducer,
  onlineUsers: onlineUsersReducer,
  allUsers: AllUsersReducer,
  message: messageReducer,
  messageError: errorReducer,
});

// =============================================
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// =============================================

// =============================================
const store = createStore(
  rootReducer,

  // applyMiddleware(localStorageMiddleware),
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  composeEnhancers(applyMiddleware(localStorageAuthMiddleware))
);
// ----------------------------------------------

export default store;
