import React from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// ===================
const NotificationModal = ({ open, handleCloseModalNotification, message }) => {
  const handleClose = () => {};

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="modalDialog"
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <IconButton
        onClick={handleCloseModalNotification}
        color="primary"
        className="closeModal"
      >
        <CloseIcon className="deliteCard" />
      </IconButton>
      <DialogContent className="modalContent">
        <Typography variant="p">
          You have a new message from
          <Typography
            component="span"
            style={{ fontWeight: "bold", color: "blue", marginLeft: "5px" }}
          >
            {message && message.from.name}
          </Typography>
        </Typography>
        <Typography variant="h6" className="messageText">
          {message && message.text}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
