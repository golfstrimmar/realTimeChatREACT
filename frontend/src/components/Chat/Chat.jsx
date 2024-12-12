// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import {
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Paper,
// } from "@mui/material";
// import axios from "axios";

// // Получаем URL сервера из переменной окружения
// const serverUrl = process.env.REACT_APP_API_URL;

// const socket = io(serverUrl); // Подключение к серверу Socket.IO

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   // Загружаем сообщения с сервера при монтировании компонента
//   useEffect(() => {
//     // Получаем сообщения с API
//     axios
//       .get(`${serverUrl}/messages`)
//       .then((response) => {
//         setMessages(response.data);
//         console.log("messages", response.data);
//       })
//       .catch((error) => {
//         console.error("Error loading messages:", error);
//       });

//     socket.on("receiveMessage", (msg) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, []);

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       socket.emit("sendMessage", message);
//       setMessages((prevMessages) => [...prevMessages, message]);
//       setMessage("");
//     }
//   };

//   return (
//     <Paper style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
//       <h2>Chat</h2>
//       <List style={{ maxHeight: "300px", overflowY: "auto" }}>
//         {messages.map((msg, index) => (
//           <ListItem key={index}>
//             <ListItemText primary={msg.createdAt} />
//             <ListItemText primary={msg.text} />
//           </ListItem>
//         ))}
//       </List>
//       <TextField
//         label="Type your message"
//         variant="outlined"
//         fullWidth
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         style={{ marginBottom: "10px" }}
//       />
//       <Button variant="contained" color="primary" onClick={handleSendMessage}>
//         Send
//       </Button>
//     </Paper>
//   );
// };

// export default Chat;

import React, { useState } from "react";
import Message from "../Message/Message";
import InputField from "../InputField/InputField";
import Header from "../Header/Header";

const Chat = ({ messages, socket }) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <Header />
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} text={msg} />
        ))}
      </div>
      <InputField
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
