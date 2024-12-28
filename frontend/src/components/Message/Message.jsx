import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Box,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import ModalComponent from "../Modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditMessage,
  setDeliteMessage,
} from "../../redux/actions/messageActions";
import "./Message.scss";
import { setErrorMessage } from "../../redux/actions/errorActions";
// ==============
const Message = ({ message, onDeleteComment }) => {
  // ---------------------

  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState(false);
  const [authorComment, setAuthorComment] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  // // ---------------------
  useEffect(() => {
    if (user && user.id === message.author) {
      setAuthor(true);
    }
    if (!user) {
      setAuthor(false);
    }
  }, [user, message]);
  // // ---------------------
  const handleLike = (messageId, type) => {
    console.log("----like message:", messageId, type);
    if (socket) {
      socket.emit("likeMessage", messageId, type);
    }
  };

  const handleDeleteComment = (commentId) => {
    onDeleteComment(message._id, commentId);
  };
  const handleEditMessage = () => {
    console.log("--edit message id:", message._id);
    if (message) {
      dispatch(setEditMessage(message));
    }
  };
  const handleDeliteMessage = () => {
    console.log("--delite message id:", message._id);
    if (message) {
      dispatch(setDeliteMessage(message));
    }
  };
  const handleOpenModal = () => {
    if (user) {
      setOpen(true);
    } else {
      dispatch(setErrorMessage("Please log in to add a comment."));
    }
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  // ---------------------
  return (
    <>
      <Card className="message-card" style={{ width: "100%" }}>
        <CardContent className="message-card-content">
          {/* Message author */}
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
            className="MessageInfo"
          >
            {/* message.name*/}
            {message.name && (
              <Typography
                variant="caption"
                color="textSecondary"
                gutterBottom
                className="message-author"
              >
                {message.name}
              </Typography>
            )}
            {/* Message timestamp */}
            <Typography
              variant="caption"
              color="textSecondary"
              gutterBottom
              className="message-timestamp"
            >
              {message.createdAt}
            </Typography>
          </Box>
          {/* Message file (Image or Video) */}
          {message.file && (
            <div className="message-file-container">
              {message.file && message.file.endsWith(".mp4") ? (
                <video
                  className="message-file"
                  controls
                  src={message.file}
                  alt="Uploaded Video"
                />
              ) : (
                <CardMedia
                  component="img"
                  image={message.file}
                  alt="Uploaded File"
                  className="message-file"
                />
              )}
            </div>
          )}
          {/* Message text */}
          <Typography component="div" className="message-text">
            {message.text}
          </Typography>
          {/* Likes */}
          <Typography variant="body2" component="div" color="textSecondary">
            <span
              className="like-button"
              role="img"
              aria-label="like"
              onClick={() => handleLike(message._id, "positive")}
            >
              👍
            </span>
            {message.positiveLikes}
            <span
              className="like-button"
              role="img"
              aria-label="dislike"
              onClick={() => handleLike(message._id, "negative")}
            >
              👎
            </span>
            {message.negativeLikes}
            {/* Comment*/}
            <CommentIcon
              className="comment-icon"
              onClick={handleOpenModal}
              color="primary"
            />
            {/* Edit*/}
            {author && (
              <EditIcon
                className="edit-icon deliteCard"
                onClick={handleEditMessage}
              />
            )}
            {/* Delete*/}
            {author && (
              <DeleteIcon
                color="error"
                className="delete-icon deliteCard"
                onClick={handleDeliteMessage}
              />
            )}
          </Typography>
          {/* Divider */}
          <Divider style={{ margin: "12px 0" }} />
          {/* Comments */}
          <Typography
            variant="body2"
            component="div"
            color="textSecondary"
            style={{ marginBottom: "12px" }}
          >
            <strong>Comments:</strong>
            {message.comments.length > 0 ? (
              message.comments.map((comment, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <div className="comment-block">
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "bold", display: "inline-block" }}
                      className="comment-name"
                    >
                      {comment.name}:
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ display: "inline", marginLeft: "8px" }}
                      className="comment-text"
                    >
                      {comment.text}
                    </Typography>

                    {user && comment.user === user.id && (
                      <DeleteIcon
                        color="error"
                        className="delete-icon"
                        onClick={() => handleDeleteComment(comment._id)}
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ marginTop: "8px" }}
              >
                No comments yet
              </Typography>
            )}
          </Typography>
        </CardContent>
      </Card>
      <ModalComponent
        open={open}
        setOpen={setOpen}
        handleCloseModal={handleCloseModal}
        message={message}
      />
    </>
  );
};

export default Message;
