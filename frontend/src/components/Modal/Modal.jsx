import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./Modal.scss";
import { useSelector, useDispatch } from "react-redux";
const ModalComponent = ({
  openCommentModal,
  currentMessage,
  setOpenCommentModal,
  message,
  commentIdToEdit,
  setCommentIdToEdit,
}) => {
  const [commentText, setCommentText] = useState("");
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  // =========================
  useEffect(() => {
    console.log("currentMessage", currentMessage);
    console.log("openCommentModal", openCommentModal);
  }, [currentMessage, openCommentModal]);
  // =========================
  useEffect(() => {
    if (commentIdToEdit) {
      const currentComment = currentMessage.comments.find(
        (comment) => comment._id === commentIdToEdit
      );
      setCommentText(currentComment.text);
    } else {
      setCommentText("");
    }
  }, [commentIdToEdit]);
  // =========================
  const handleAddComment = () => {
    if (commentIdToEdit) {
      if (user && commentText.trim()) {
        const commentToEdit = {
          text: commentText,
          commentIdToEdit: commentIdToEdit,
        };
        console.log("--modal Edit comment:", currentMessage._id, commentToEdit);
        socket.emit("commentToEdit", currentMessage._id, commentToEdit);

        setCommentText("");
        setOpenCommentModal(false);
        setCommentIdToEdit(null);
      }
    } else {
      if (user && commentText.trim()) {
        const comment = {
          text: commentText,
          user: user.id,
          name: user.name,
        };
        console.log("--modal add comment:", currentMessage._id, comment);
        socket.emit("addComment", currentMessage._id, comment);
        setCommentText("");
        setOpenCommentModal(false);
      }
    }
  };

  const handleCommentChange = (e) => {
    if (e.target.value) {
      setCommentText(e.target.value);
    } else {
      setCommentText("");
      setCommentIdToEdit(null);
    }
  };

  const handleBackdropClick = () => {
    setOpenCommentModal(false);
    setCommentText("");
    setCommentIdToEdit(null);
  };

  return (
    <Dialog
      open={openCommentModal}
      onClose={handleBackdropClick}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <IconButton
        className="closeModal"
        onClick={() => setOpenCommentModal(false)}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent className="CommentModal-content">
        <TextField
          label="Add a comment"
          variant="outlined"
          value={commentText}
          onChange={handleCommentChange}
          style={{ marginBottom: "12px" }}
          className="commentInput"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          fullWidth
        >
          {commentIdToEdit ? "Edit Comment" : "Add Comment"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ModalComponent;
