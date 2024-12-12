import React, { useState } from "react";
import Chat from "../components/Chat/Chat";

const HomePage = ({ messages, socket }) => {
  return (
    <div>
      <h1>Welcome to the Chat!</h1>
      <Chat messages={messages} socket={socket} />
    </div>
  );
};

export default HomePage;
