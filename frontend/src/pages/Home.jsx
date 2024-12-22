import React, { useState } from "react";
import Chat from "../components/Chat/Chat";
import { Typography } from "@mui/material";

const HomePage = ({ messages, socket }) => {
  return (
    <div className="page-container">
      <Typography variant="h3">Welcome to the Chat!</Typography>
      <Chat messages={messages} socket={socket} />
    </div>
  );
};

export default HomePage;
