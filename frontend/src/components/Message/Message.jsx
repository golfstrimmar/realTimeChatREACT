import React from "react";
import { Typography, ListItem, ListItemText } from "@mui/material";
const Message = ({ message }) => {
  return (
    <ListItem className="message">
      <ListItemText primary={message.createdAt} />
      <ListItemText primary={message.text} />
    </ListItem>
  );
};

export default Message;
