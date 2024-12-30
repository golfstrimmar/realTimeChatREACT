import React, { useState } from "react";
import Chat from "../components/Chat/Chat";
import { Typography } from "@mui/material";
import chatBg from "../assets/img/chat.jpg";
const HomePage = ({ messages, socket }) => {
  return (
    <div className="page-container home">
      <div className="imgs">
        <img src={chatBg} alt="" />
      </div>
      <Typography
        variant="h3"
        style={{ marginBottom: "20px", textAlign: "center" }}
      >
        Welcome to the Chat!
      </Typography>
      <Chat messages={messages} socket={socket} />
    </div>
  );
};

export default HomePage;
