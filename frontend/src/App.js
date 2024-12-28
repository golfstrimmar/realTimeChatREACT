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
import NotificationModal from "./components/Modal/NotificationModal";

const serverUrl = process.env.REACT_APP_API_URL;

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const messageError = useSelector((state) => state.messageError.messageError);
  let socket;
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // ------------------------

  // ------------------------
  useEffect(() => {
    dispatch(restoreAuth());
    socket = window.socketInstance;

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
      const authData = JSON.parse(localStorage.getItem("auth"));
      let userData = null;

      if (authData && authData.user) {
        userData = authData.user;
      }
      if (userData) {
        window.socketInstance.emit(
          "userRefresh",
          userData,
          window.socketInstance.id
        );
      }
      dispatch(setSocket(window.socketInstance));
      window.socketInstance.emit("allUsers");

      window.socketInstance.on("Users", (users) => {
        dispatch(setAllUsers(users));
      });

      window.socketInstance.on("onlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
    });

    return () => {
      if (socket) {
        socket.disconnect();
        window.socketInstance = null;
        dispatch(setSocket(null));
      }
    };
  }, [dispatch, socket, isDisconnecting]);

  return (
    <Router>
      <Header />
      <AppRouter />
      <NotificationModal messageError={messageError} />
    </Router>
  );
}

export default App;
