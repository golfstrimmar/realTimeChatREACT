import React, { useEffect, useState } from "react";
import { Typography, Card, Button, Box, TextField } from "@mui/material";
import "./Privat.scss";
import { useSelector, useDispatch } from "react-redux";
import { setErrorMessage } from "../../redux/actions/errorActions";
// ===========================
const Privat = ({ open, privat, persona, setDataMessage }) => {
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  const [privatMessage, setPrivatMessage] = useState();
  const [openModalNotification, setOpenModalNotification] = useState(false);
  const [privatText, setPrivatText] = useState("");
  const [resiver, setResiver] = useState(null);
  const [info, setInfo] = useState([]);
  const dispatch = useDispatch();
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

  const handleAddPrivatMessage = () => {
    if (!privatText) {
      dispatch(setErrorMessage("Write something to the recipient."));
      return;
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
