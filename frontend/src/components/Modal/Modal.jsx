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
import { useSelector, useDispatch } from "react-redux";
// import { setErrorMessage } from "./redux/actions/errorActions";
const ModalComponent = ({
  open,
  setOpen,
  handleCloseModal,
  // handleCommentChange,
  message,
}) => {
  const [commentText, setCommentText] = useState("");
  // const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  //  =========================
  const handleAddComment = () => {
    // if (user) {
    if (commentText.trim()) {
      setOpen(false);
      const comment =
        (message._id,
        {
          text: commentText,
          user: user.id,
          name: user.name,
        });
      //========================================
      console.log("--modal add comment:", message._id, comment);
      socket.emit("addComment", message._id, comment);
      setCommentText("");
      setOpen(false);
    }
    // } else {
    // setOpen(false);

    // setTimeout(() => {
    //   setCommentText("");
    //   setErrorMessage("");
    // }, 2000);
    // }
  };
  // --------------
  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };
  // --------------
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
