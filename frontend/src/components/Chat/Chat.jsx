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
import MessageList from "../MessageList/MessageList";

// ==============================

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileURL, setFileURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const socket = useSelector((state) => state.socket.socket);
  const [messageIdToEdit, setMessageIdToEdit] = useState(null);
  // =======================
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/messages`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
      });

    if (socket) {
      socket.on("deleteMessage", (id) => {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== id)
        );
      });
    }

    return () => {
      if (socket) {
        // socket.off("receiveMessage");
        // socket.off("updateMessage");
        socket.off("deleteMessage");
      }
    };
  }, [user, socket]);

  //========================================
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  }, [errorMessage]);
  //========================================
  useEffect(() => {
    console.log("++_+___+++++messages channge", messages);
  }, [messages]);
  //========================================
  const sendMessage = async () => {
    if (!user) {
      setErrorMessage("Please log in to send a message.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    if (!message.trim()) {
      setErrorMessage("The text is required.");
      return;
    }
    if (message.trim() || file) {
      setErrorMessage("");
      setLoading(true);
      const messageData = {
        text: message,
        author: user.id,
        name: user.name,
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

      if (messageIdToEdit) {
        socket.emit("updateMessage", {
          ...messageData,
          _id: messageIdToEdit,
        });
        socket.on("receiveMessage", (updatedMessage) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === updatedMessage._id ? updatedMessage : msg
            )
          );
        });
      } else {
        socket.emit("sendMessage", messageData);
        socket.on("receiveMessage", (msg) => {
          setMessages((prevMessages) => [...prevMessages, msg]);
        });
      }
      setErrorMessage("");
      setLoading(false);
      setMessage("");
      setFile(null);
      setFileURL(null);
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
  const handleEditMessage = (message) => {
    if (message) {
      // console.log("messages", messages);
      let temp = messages.find((msg) => msg._id === message);
      setMessageIdToEdit(temp._id);
      setMessage(temp.text);
      setFileURL(temp.file);
      console.log("chat edit message:", message);
      //   socket.emit("deleteMessage", message);
    }
    // setMessage("");
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
  // const renderFilePreview = () => {
  //   if (fileURL) {
  //     if (file.type.startsWith("image")) {
  //       return (
  //         <CardMedia
  //           component="img"
  //           image={fileURL}
  //           alt="Uploaded File"
  //           className="uploadedFile"
  //         />
  //       );
  //     }
  //     if (file.type.startsWith("video")) {
  //       return (
  //         <CardMedia
  //           component="video"
  //           src={fileURL}
  //           controls
  //           className="uploadedFile"
  //         />
  //       );
  //     }
  //     if (fileURL.startsWith("http")) {
  //       if (fileURL.endsWith(".mp4") || fileURL.endsWith(".webm")) {
  //         return (
  //           <CardMedia
  //             component="video"
  //             src={fileURL}
  //             controls
  //             className="uploadedFile"
  //           />
  //         );
  //       } else if (
  //         fileURL.endsWith(".jpg") ||
  //         fileURL.endsWith(".jpeg") ||
  //         fileURL.endsWith(".png")
  //       ) {
  //         return (
  //           <CardMedia
  //             component="img"
  //             image={fileURL}
  //             alt="Uploaded File"
  //             className="uploadedFile"
  //           />
  //         );
  //       }
  //     }
  //   }
  //   return null;
  // };
  const renderFilePreview = () => {
    // Если есть файл по ссылке или локальный файл
    const url = file ? URL.createObjectURL(file) : fileURL; // Если есть локальный файл, используем его, иначе используем URL

    if (url) {
      if (url.startsWith("http")) {
        // Это ссылка на файл (например, на Cloudinary)
        if (url.endsWith(".mp4") || url.endsWith(".webm")) {
          return (
            <CardMedia
              component="video"
              src={url}
              controls
              className="uploadedFile"
            />
          );
        } else if (
          url.endsWith(".jpg") ||
          url.endsWith(".jpeg") ||
          url.endsWith(".png")
        ) {
          return (
            <CardMedia
              component="img"
              image={url}
              alt="Uploaded File"
              className="uploadedFile"
            />
          );
        }
      } else {
        // Локальный файл (если файл выбран, но еще не отправлен)
        if (file.type.startsWith("image")) {
          return (
            <CardMedia
              component="img"
              image={url}
              alt="Uploaded File"
              className="uploadedFile"
            />
          );
        }
        if (file.type.startsWith("video")) {
          return (
            <CardMedia
              component="video"
              src={url}
              controls
              className="uploadedFile"
            />
          );
        }
      }
    }

    return null;
  };

  //  ============================
  return (
    <div className="chat-container">
      <AllUsers />
      <OnlineUsers />
      {messages.length > 0 ? (
        <MessageList
          messages={messages}
          handleLike={handleLike}
          handleAddComment={handleAddComment}
          handleDeleteComment={handleDeleteComment}
          handleEditMessage={handleEditMessage}
          handleDeleteMessage={handleDeleteMessage}
        />
      ) : (
        <Typography variant="h6">No messages yet</Typography>
      )}
      <Paper
        style={{ padding: "26px 15px 15px 15px", marginTop: "16px" }}
        className="chat"
      >
        <div className="cl">
          <div className="message-exect">
            <Typography variant="p" color="error">
              {errorMessage}
            </Typography>
            {!errorMessage && loading && <Loading />}
          </div>

          <TextField
            fullWidth
            variant="outlined"
            label="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            rows={4}
            size="small"
            className="messageInput"
          />
          <Button
            onClick={sendMessage}
            endIcon={<SendIcon />}
            className="sendButton"
          />
        </div>
        <IconButton component="label" className="fileInput">
          <AttachFileIcon />
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
        </IconButton>
        {renderFilePreview()}
      </Paper>
    </div>
  );
};

export default Chat;
