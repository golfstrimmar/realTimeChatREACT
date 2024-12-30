import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  IconButton,
  Button,
  Box,
  TextField,
  CardMedia,
} from "@mui/material";
import "./Privat.scss";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSelector, useDispatch } from "react-redux";
import { setErrorMessage } from "../../redux/actions/errorActions";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import sha1 from "js-sha1";
// ===========================
const Privat = ({ open, privat, persona, setDataMessage, setLoading }) => {
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  const [privatMessage, setPrivatMessage] = useState();
  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [privatText, setPrivatText] = useState("");
  const [info, setInfo] = useState([]);
  const dispatch = useDispatch();
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  // =============

  useEffect(() => {
    setInfo(privat);
  }, [open, privat]);

  useEffect(() => {
    if (privatMessage) {
      setOpenModalNotification(true);
    }
  }, [privatMessage]);

  // =============================
  const clearChat = () => {
    socket.emit("ClearChat", user.id, persona._id);
  };
  // =============================
  const clearAll = () => {
    socket.emit("clearAll");
  };
  // =============================
  const handleInputChange = (event) => {
    setPrivatText(event.target.value);
  };
  // =============================

  const handleAddPrivatMessage = async () => {
    if (!privatText) {
      dispatch(setErrorMessage("Write something to the recipient."));
      return;
    }

    const data = {
      text: privatText,
      from: user,
      to: persona,
    };

    if (file) {
      setLoading(true);
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
          uploadUrl = "https://api.cloudinary.com/v1_1/dke0nudcz/image/upload";
        } else if (file.type.startsWith("video")) {
          uploadUrl = "https://api.cloudinary.com/v1_1/dke0nudcz/video/upload";
        } else {
          dispatch(setErrorMessage("Unsupported file type."));
          return;
        }

        const fileResponse = await axios.post(uploadUrl, formData);
        const fileUrl = fileResponse.data.secure_url;
        console.log("Uploaded file URL from Cloudinary:", fileUrl);

        data.file = fileUrl;
      } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        dispatch(setErrorMessage("Failed to upload file."));
        return;
      }
    }
    setDataMessage(data);
    setFile(null);
    setPrivatText("");
  };

  // =============================
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
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    e.target.value = null;
  };

  // =============================

  const extractPublicId = (url) => {
    const regex = /\/v(\d+)\/(.*)\./;
    const match = url.match(regex);
    return match ? match[2] : null; // Возвращает public_id
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
  const handleDeliteMessage = (item) => {
    if (item) {
      if (item.file) {
        deleteImageFromCloudinary(item.file);
      }
      socket.emit("delitePrivatMessage", item);
    }
  };
  // =============================
  return (
    <>
      <div className="privat">
        {user && privat && privat.length === 0 && (
          <Typography variant="h6">Your correspondence is empty.</Typography>
        )}

        {user &&
          info &&
          info.length > 0 &&
          info.map((item, index) => {
            if (item.status !== "archived") {
              return (
                <Card
                  key={index}
                  className={`privat-item ${item.status === "sent" ? " _is-sent" : "_is-received"}`}
                >
                  {/* ---- file------ */}
                  {item.file && (
                    <div className="message-file-container">
                      {item.file && item.file.endsWith(".mp4") ? (
                        <video
                          className="message-file"
                          controls
                          src={item.file}
                          alt="Uploaded Video"
                        />
                      ) : (
                        <CardMedia
                          component="img"
                          image={item.file}
                          alt="Uploaded File"
                          className="message-file"
                        />
                      )}
                    </div>
                  )}
                  {/* ---text----- */}
                  <Typography variant="h6" className=" privat-text">
                    {item.text}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Typography variant="span" className="privat-date">
                      {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                    {/* Delete*/}
                    {item.from._id === user.id && (
                      <DeleteIcon
                        color="error"
                        className="delete-icon deliteCard"
                        onClick={() => {
                          handleDeliteMessage(item);
                        }}
                        style={{ marginLeft: "auto" }}
                      />
                    )}
                    {/* -------------*/}
                  </div>
                </Card>
              );
            }
          })}
      </div>

      <Box className="privat-form">
        <hr
          style={{
            margin: "20px 0 0 0",
            borderBottom: "1px solid #bfbebe",
            height: "1px",
            width: "100%",
          }}
        />
        <Typography variant="p">
          Send a message to
          <Typography
            variant="span"
            color="blue"
            style={{ marginLeft: "5px" }}
            className="persona-name"
          >
            {persona?.name}
          </Typography>
        </Typography>
        <TextField
          label={`Add a  message `}
          fullWidth
          variant="outlined"
          size="small"
          value={privatText}
          onChange={handleInputChange}
          className="privat-input"
        />
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

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPrivatMessage}
          className="privat-button _btn"
        >
          Add Privat Message
        </Button>
      </Box>

      <div className="buttons">
        <Button
          variant="contained"
          color="error"
          style={{ marginTop: "10px" }}
          onClick={() => {
            clearChat();
          }}
          className="X-button clear-button _btn"
        >
          Clear chat
        </Button>
        <Button
          variant="contained"
          color="error"
          style={{ marginTop: "10px", display: "none" }}
          onClick={() => {
            clearAll();
          }}
          className="X-button _btn"
        >
          X
        </Button>
      </div>
    </>
  );
};

export default Privat;
