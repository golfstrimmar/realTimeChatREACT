import React, { useState, useEffect } from "react";
import Message from "../Message/Message";
import { io } from "socket.io-client";
import axios from "axios";
import {
  List,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

// Подключение к серверу Socket.IO
const socket = io(process.env.REACT_APP_API_URL);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Загружаем сообщения с сервера при монтировании компонента
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/messages`)
      .then((response) => {
        setMessages(response.data);
        console.log("messages loaded:", response.data);
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      });

    // Обработка входящих сообщений от сервера
    socket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    // Обработчик обновления сообщения
    socket.on("updateMessage", (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateMessage");
    };
  }, []);

  // Отправка сообщения на сервер через сокет
  const sendMessage = () => {
    if (message.trim()) {
      // const messageObject = {
      //   text: message,
      //   createdAt: new Date(),
      // };
      const messageObject = { text: message };
      console.log("Sending message:", messageObject);
      socket.emit("sendMessage", messageObject);
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   { text: message, createdAt: new Date() },
      // ]); // Добавляем сообщение локально
      setMessage(""); // Очищаем поле ввода
    }
  };
  const handleLike = (messageId, type) => {
    socket.emit("likeMessage", messageId, type);
  };
  const handleAddComment = (id, comment) => {
    socket.emit("addComment", id, comment);
  };
  //  ============================
  return (
    <div className="page-container chat-container">
      {messages.length > 0 ? (
        <List>
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message}
              onLike={handleLike}
              onAddComment={handleAddComment}
            />
          ))}
        </List>
      ) : (
        <Typography variant="h6">No messages yet</Typography>
      )}

      <Paper style={{ padding: "16px", marginTop: "16px" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={10}>
            <TextField
              fullWidth
              variant="outlined"
              label="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={4}
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              fullWidth
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Chat;
