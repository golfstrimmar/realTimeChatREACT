import React, { useEffect, useState } from "react";
import { Typography, Card, Button, Box, TextField } from "@mui/material";
import "./Privat.scss";
import NotificationModal from "../Modal/NotificationModal";
import { useSelector } from "react-redux";
// ===========================
const Privat = ({ open, privat, persona, setDataMessage }) => {
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  const [privatMessage, setPrivatMessage] = useState();
  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [privatText, setPrivatText] = useState("");
  const [resiver, setResiver] = useState(null);
  const [info, setInfo] = useState([]);
  // =============

  useEffect(() => {
    setInfo(privat);
  }, [open, privat]);

  useEffect(() => {
    if (privatMessage) {
      setOpenModalNotification(true);
    }
  }, [privatMessage]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  }, [errorMessage]);
  // =============================

  // =============================
  const handleCloseModalNotification = () => {
    setOpenModalNotification(false);
  };
  // =============================

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

  const handleAddPrivatMessage = () => {
    if (!privatText) {
      return setErrorMessage("Write something to the recipient.");
    }

    setDataMessage({ text: privatText, from: user, to: persona });
    setPrivatText("");
  };
  // =============================
  return (
    <>
      <div className="privat">
        {user && privat && privat.length === 0 && (
          <Typography variant="h6">Your correspondence is empty.</Typography>
        )}
        {user && (
          <div style={{ marginBottom: "20px" }}>
            <Typography variant="h6">
              The user is ready to communicate:
              <Typography
                variant="span"
                color="blue"
                style={{ margin: "8px 5px 0 5px" }}
              >
                {persona?.name}
              </Typography>
            </Typography>
          </div>
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
                  <Typography variant="span">
                    From: {item.from.name} to {item.to.name}
                  </Typography>
                  <Typography variant="span"> Status: {item.status}</Typography>
                  <Typography variant="h6" className=" privat-text">
                    {item.text}
                  </Typography>
                  <Typography variant="span">
                    {new Date(item.timestamp).toLocaleString()}
                  </Typography>
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
        <Typography variant="h6">
          Sent message to{" "}
          <Typography variant="span" color="blue">
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
        />
        <Typography variant="h5" color="error">
          {errorMessage}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPrivatMessage}
          className="privat-button"
        >
          Add Privat Message
        </Button>
      </Box>
      <NotificationModal
        open={openModalNotification}
        handleCloseModalNotification={handleCloseModalNotification}
        message={privatMessage}
      />
      <div className="buttons">
        <Button
          variant="contained"
          color="error"
          style={{ marginTop: "10px" }}
          onClick={() => {
            clearChat();
          }}
          className="X-button clear-button"
        >
          Clear chat
        </Button>
        <Button
          variant="contained"
          color="error"
          style={{ marginTop: "10px",display:"none" }}
          onClick={() => {
            clearAll();
          }}
          className="X-button"
        >
          X
        </Button>
      </div>
    </>
  );
};

export default Privat;
