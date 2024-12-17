import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./Modal.scss";
const ModalComponent = ({
  open,
  handleCloseModal,
  handleAddComment,
  handleCommentChange,
  commentText,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
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
      <DialogContent>
        {/* comment+ */}
        <TextField
          label="Add a comment"
          fullWidth
          variant="outlined"
          value={commentText}
          onChange={handleCommentChange}
          size="small"
          style={{ marginBottom: "12px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          fullWidth
        >
          Add Comment
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ModalComponent;
