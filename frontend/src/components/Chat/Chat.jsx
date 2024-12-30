import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  IconButton,
  Button,
  TextField,
  CardMedia,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import AllUsers from "../AllUsers/AllUsers";
import Loading from "../Loading/Loading";
import MessageList from "../MessageList/MessageList";
import "./Chat.scss";
import sha1 from "js-sha1";
// ------
import {
  clearEditMessage,
  clearDeliteMessage,
} from "../../redux/actions/messageActions";
import { useSelector, useDispatch } from "react-redux";
import { setErrorMessage } from "../../redux/actions/errorActions";

// ==============================

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageIdToEdit, setMessageIdToEdit] = useState(null);
  const inputRef = useRef(null);
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.auth.user);
  const messageToEdit = useSelector((state) => state.message.messageToEdit);
  const messageToDelite = useSelector((state) => state.message.messageToDelite);
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const prevMessage = useRef(message);
  // =======================
  // =======================
  useEffect(() => {
    if (prevMessage.current !== null && message === null) {
      inputRef.current.blur();
    }
    prevMessage.current = message;
  }, [message, messageToEdit, isFocused]);
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
      const handleReceiveMessage = (msg) => {
        console.log("+++++ Receive message", msg);
        setMessages((prevMessages) => {
          return prevMessages.some((message) => message._id === msg._id)
            ? prevMessages.map((message) =>
                message._id === msg._id ? { ...message, ...msg } : message
              )
            : [...prevMessages, msg];
        });
      };

      const handleUpdateMessage = (updatedMessage) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
      };
      const handleDeleteMessage = (mes) => {
        console.log("+++++ Delete message", mes);
        setMessages((prevMessages) => {
          return prevMessages.filter((message) => {
            return message._id !== mes._id;
          });
        });
      };

      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("updateMessage", handleUpdateMessage);
      socket.on("deleteMessage", handleDeleteMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("updateMessage", handleUpdateMessage);
        socket.off("deleteMessage", handleUpdateMessage);
      };
    }
  }, [socket]);

  useEffect(() => {
    console.log("+++++messages channge", messages);
  }, [messages]);
  //========================================

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
  //========================================

  const sendMessage = async (event) => {
    if (!user) {
      dispatch(setErrorMessage("Please log in to send a message."));
      return;
    }

    if (!message) {
      dispatch(setErrorMessage("The text is required."));
      return;
    }
    if (message.trim() || file) {
      setLoading(true);
      const messageData = {
        text: message,
        author: user.id,
        name: user.name,
      };
      if (file) {
        const maxFileSize = 100 * 1024 * 1024; // 100 MB
        if (file.size > maxFileSize) {
          dispatch(setErrorMessage("File is too large. Max size is 100 MB."));
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
            dispatch(setErrorMessage("Unsupported file type."));
            return;
          }

          const fileResponse = await axios.post(uploadUrl, formData);
          const fileUrl = fileResponse.data.secure_url;

          messageData.file = fileUrl;
        } catch (error) {
          console.error("Error uploading file to Cloudinary:", error);
          dispatch(setErrorMessage("Failed to upload file."));
          return;
        }
      }

      if (messageToEdit) {
        console.log("--updateMessage--", messageToEdit);
        socket.emit("updateMessage", {
          ...messageData,
          _id: messageToEdit._id,
        });

        dispatch(clearEditMessage());
      } else {
        console.log("--sendMessage--", messageData);
        socket.emit("sendMessage", messageData);
      }
      setMessage(null);
      setLoading(false);
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

  // ===================================
  const extractPublicId = (url) => {
    const regex = /\/v(\d+)\/(.*)\./;
    const match = url.match(regex);
    return match ? match[2] : null;
  };

  // Функция для создания подписи
  const createSignature = (publicId, apiSecret, timestamp) => {
    // Формируем строку для подписи: public_id=...&timestamp=...&api_secret=...
    const params = `public_id=${publicId}&timestamp=${timestamp}`;
    const signature = sha1(`${params}${apiSecret}`); // Генерируем подпись с помощью sha1
    return signature;
  };

  const deleteImageFromCloudinary = async (fileUrl) => {
    const publicId = extractPublicId(fileUrl); // Извлекаем public_id

    if (publicId) {
      const apiKey = "125957593299356";
      const apiSecret = "GUEplX6OFLU7oTwpe4IGFdf_V4w";
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = createSignature(publicId, apiSecret, timestamp);

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dke0nudcz/image/destroy",
          {
            public_id: publicId,
            api_key: apiKey,
            signature: signature,
            timestamp: timestamp,
          }
        );

        if (response.data.result === "ok") {
          console.log("Image successfully deleted from Cloudinary");
        } else {
          console.log("Failed to delete image from Cloudinary", response.data);
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }
  };
  // ===================================
  useEffect(() => {
    if (messageToEdit) {
      console.log("--messageToEdit redux :", messageToEdit);
      setMessageIdToEdit(messageToEdit._id);
      setMessage(messageToEdit.text);
      setFileURL(messageToEdit.file);
    } else {
      dispatch(clearEditMessage());
      setMessageIdToEdit(null);
      setMessage(null);
      setFileURL(null);
    }
  }, [messageToEdit]);
  // ===================================
  useEffect(() => {
    if (messageToDelite) {
      console.log("--messageToDelite redux :", messageToDelite);
      if (messageToDelite.file) {
        deleteImageFromCloudinary(messageToDelite.file);
      }
      socket.emit("deleteMessage", messageToDelite);
      dispatch(clearDeliteMessage());
    }
  }, [messageToDelite]);

  // ============-
  const renderFilePreview = () => {
    const url = file ? URL.createObjectURL(file) : fileURL;

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
  // ============-

  const handleFocus = () => {
    if (!isFocused) {
      console.log("focus");
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    if (isFocused) {
      console.log("Blur");
      setIsFocused(false);
    }
  };
  //  ============================
  const handleInput = (e) => {
    if (e.target.value) {
      return setMessage(e.target.value);
    }
    // setMessage(null);
  };
  //  ============================
  return (
    <div className="chat-container">
      <AllUsers />
      <OnlineUsers />
      {messages.length > 0 ? (
        <MessageList
          messages={messages}
        />
      ) : (
        <Typography variant="h6" className="noMessages">No messages yet</Typography>
      )}
      <Paper
        style={{ padding: "26px 15px 15px 15px", marginTop: "16px" }}
        className="chat"
      >
        <div className="cl">
          {loading && <Loading />}
          <TextField
            fullWidth
            variant="outlined"
            label="Type a message..."
            value={message || ""}
            inputRef={inputRef}
            onChange={(e) => handleInput(e)}
            size="small"
            className="messageInput"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <Button
            onClick={sendMessage}
            endIcon={<SendIcon />}
            className="sendButton"
          />
        </div>
        {/* --------add file */}
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
        {/* ------------ */}
      </Paper>
    </div>
  );
};

export default Chat;
