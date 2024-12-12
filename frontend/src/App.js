import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import Header from "./components/Header/Header";

// import LoginPage from "./pages/LoginPage";
// import ProfilePage from "./pages/ProfilePage";
// import HomePage from "../src/pages/Home";

const serverUrl = process.env.REACT_APP_API_URL;
const socket = io(serverUrl);
function App() {
  const [messages, setMessages] = useState([]);

  // Обработка входящих сообщений от сервера
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <Router>
      <Header />
      <AppRouter />
      {/* <Routes>
        <Route
          path="/"
          element={<Home messages={messages} socket={socket} />}
        />
        {/*<Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
      </Routes> */}
    </Router>
  );
}

export default App;
