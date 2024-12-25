import React, { use, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/actions/socketActions";
import { restoreAuth, setUser } from "./redux/actions/authActions";
import { setOnlineUsers } from "./redux/actions/onlineUsersActions";
import { setAllUsers } from "./redux/actions/AllUsersActions";
import { io } from "socket.io-client"; // Библиотека для сокетов
import AppRouter from "./router/AppRouter";
import Header from "./components/Header/Header";
const serverUrl = process.env.REACT_APP_API_URL;

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  // const socket = useSelector((state) => state.socket.socket);

  // ------------------------
  // const socket = useSelector((state) => state.socket.socket);

  // Обработчик события beforeunload
  // const handleBeforeUnload = (event) => {
  //   if (socket) {
  //     socket.emit("disconnectUser");
  //     localStorage.clear();
  //     dispatch(setUser(null, null));
  //     dispatch(setSocket(null));
  //   }
  // };
  // window.addEventListener("beforeunload", handleBeforeUnload);
  // ------------------------

  // socket.emit("userConnected", user.id, socket.id);
  // ------------------------
  useEffect(() => {
    // dispatch(setSocket(null));
    dispatch(restoreAuth());
    let socket = window.socketInstance;

    if (!window.socketInstance) {
      socket = io(serverUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });
      window.socketInstance = socket;
    }

    window.socketInstance.on("connect", () => {
      console.log("Socket connected with id:", window.socketInstance.id);
      dispatch(setSocket(window.socketInstance));
      window.socketInstance.emit("allUsers");
      window.socketInstance.on("Users", (users) => {
        dispatch(setAllUsers(users));
      });

      window.socketInstance.on("onlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
      if (user) {
        window.socketInstance.emit(
          "userConnected",
          user,
          window.socketInstance.id
        );
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
        window.socketInstance = null;
        dispatch(setSocket(null));
      }
    };
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <AppRouter />
    </Router>
  );
}

export default App;
