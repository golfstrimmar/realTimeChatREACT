import React, { useState, useEffect } from "react";
import Message from "../Message/Message";
import axios from "axios";
import {
  List,
  Typography,
  Paper,
  IconButton,
  Button,
  TextField,
  CardMedia,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector, useDispatch } from "react-redux";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import "./Chat.scss";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import AllUsers from "../AllUsers/AllUsers";
import Loading from "../Loading/Loading";
// ==============================

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileURL, setFileURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const socket = useSelector((state) => state.socket.socket);

  // =======================
  useEffect(() => {
    // Загружаем сообщения с сервера
    axios
      .get(`${process.env.REACT_APP_API_URL}/messages`)
      .then((response) => {
        setMessages(response.data); // Получаем и отображаем все сообщения
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      });

    // Обработка входящих сообщений от сервера
    if (socket) {
      socket.on("receiveMessage", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]); // Добавляем новое сообщение в список
      });

      socket.on("updateMessage", (updatedMessage) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        ); // Обновляем существующее сообщение
      });

      socket.on("deleteMessage", (id) => {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== id)
        ); // Удаляем сообщение
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage");
        socket.off("updateMessage");
        socket.off("deleteMessage");
      }
    };
  }, [user, socket]);

  //========================================

  //========================================
  const sendMessage = async () => {
    if (!user) {
      setErrorMessage("Please log in to send a message.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }
    setLoading(true);
    if (!message.trim()) {
      setErrorMessage("The text is required.");
      return;
    }
    if (message.trim() || file) {
      setErrorMessage("");
      const messageData = {
        text: message,
        author: user.id,
      };
      if (file) {
        const maxFileSize = 100 * 1024 * 1024; // 100 MB
        if (file.size > maxFileSize) {
          setErrorMessage("File is too large. Max size is 100 MB.");
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "blogblog");
        formData.append("cloud_name", "dke0nudcz");
        try {
          let uploadUrl;

          if (file.type.startsWith("image")) {
            uploadUrl =
              "https://api.cloudinary.com/v1_1/dke0nudcz/image/upload";
          } else if (file.type.startsWith("video")) {
            uploadUrl =
              "https://api.cloudinary.com/v1_1/dke0nudcz/video/upload";
          } else {
            setErrorMessage("Unsupported file type.");
            return;
          }

          const fileResponse = await axios.post(uploadUrl, formData);
          const fileUrl = fileResponse.data.secure_url;

          messageData.file = fileUrl;
        } catch (error) {
          console.error("Error uploading file to Cloudinary:", error);
          setErrorMessage("Failed to upload file.");
          return;
        }
      }
      socket.emit("sendMessage", messageData);
      setMessage("");
      setFile(null);
      setFileURL(null);
      setLoading(false);
    }
  };
  // ===================================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    e.target.value = null;
  };
  // ===================================
  const handleLike = (messageId, type) => {
    socket.emit("likeMessage", messageId, type);
  };
  const handleAddComment = (id, comment) => {
    console.log("add comment:", id, comment);
    socket.emit("addComment", id, comment);
  };
  const handleDeleteComment = (id, commentId) => {
    console.log("delete comment:", id, commentId);
    socket.emit("deleteComment", id, commentId);
  };
  // ===================================
  const handleDeleteMessage = (message) => {
    if (message) {
      console.log("delete message:", message);
      socket.emit("deleteMessage", message);
      setMessage("");
    }
  };
  //  ============================
  useEffect(() => {
    if (file) {
      const fileObjectURL = URL.createObjectURL(file);
      setFileURL(fileObjectURL);
    }

    return () => {
      if (fileURL) {
        URL.revokeObjectURL(fileURL);
      }
    };
  }, [file]);
  const renderFilePreview = () => {
    if (fileURL) {
      if (file.type.startsWith("image")) {
        return (
          <CardMedia
            component="img"
            image={fileURL}
            alt="Uploaded File"
            className="uploadedFile"
          />
        );
      } else if (file.type.startsWith("video")) {
        return (
          <CardMedia
            component="video"
            src={fileURL}
            controls
            className="uploadedFile"
          />
        );
      }
    }
    return null;
  };

  //  ============================
  return (
    <div>
      <AllUsers />
      <OnlineUsers />
      {messages.length > 0 ? (
        <List className="message-list">
          {messages &&
            messages.map((message, index) => (
              <Message
                key={index}
                message={message}
                onLike={handleLike}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onDeleteMessage={handleDeleteMessage}
              />
            ))}
        </List>
      ) : (
        <Typography variant="h6">No messages yet</Typography>
      )}
      <Paper style={{ padding: "16px", marginTop: "16px" }}>
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
        <IconButton component="label" className="fileInput">
          <AttachFileIcon />
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
        </IconButton>
        <div className="message-exect">
          {renderFilePreview()}
          <Typography variant="h5" color="error">
            {errorMessage}
          </Typography>
          {!errorMessage && loading && <Loading />}
          <Button
            onClick={sendMessage}
            fullWidth
            endIcon={<SendIcon />}
            className="sendButton"
          >
            Send
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Chat;
