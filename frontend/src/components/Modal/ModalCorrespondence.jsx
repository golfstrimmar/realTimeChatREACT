import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./Modal.scss";
import { useSelector } from "react-redux";
import Privat from "./../Privat/Privat";

// ==============================
const ModalCorrespondence = ({
  open,
  handleCloseModal,
  addressee,
  setPrivatMessage,
}) => {
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  // ========================
  const [privatText, setPrivatText] = useState("");
  // ====================================
  useEffect(() => {
    if (!socket || !user) return;
    const handleNewMessageNotification = (message) => {
      if (message.to.id === user.id) {
        setPrivatMessage(message);
      }
    };
    socket.on("newMessageNotification", handleNewMessageNotification);
    return () => {
      socket.off("newMessageNotification", handleNewMessageNotification);
    };
  }, [socket, user]);
  // ====================================

  const handleAddPrivatMessage = () => {
    const data = {
      text: privatText,
      from: user,
      to: addressee,
    };
    console.log("privat message to send:", data);
    socket.emit("sendPrivatMessage", data);
  };

  const handleInputChange = (event) => {
    setPrivatText(event.target.value);
  };
  const handleSubmit = () => {
    handleAddPrivatMessage();
    handleCloseModal();
  };
  // ========================
  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      className="modalDialog"
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <IconButton
        onClick={handleCloseModal}
        color="primary"
        className="closeModal"
      >
        <CloseIcon className="deliteCard" />
      </IconButton>
      <DialogContent className="modalContent">
        <Typography variant="p" style={{ margin: "12px 0px" }}>
          Add Privat Message to
          <Typography
            variant="span"
            style={{ fontWeight: "bold", margin: "0 5px", color: "coral" }}
          >
            {addressee?.name}
          </Typography>
          from
          <Typography
            variant="span"
            style={{ fontWeight: "bold", margin: "0 5px", color: "blue" }}
          >
            {user?.name}
          </Typography>
        </Typography>
        <TextField
          label={`Add a  message `}
          fullWidth
          variant="outlined"
          size="small"
          style={{ margin: "12px 0px" }}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Add Privat Message
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCorrespondence;
