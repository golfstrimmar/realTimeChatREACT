import React, { useState, useEffect } from "react";
import {
  Typography,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  CardMedia,
  Divider,
  Modal,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import "./Message.scss";
import ModalComponent from "../Modal/Modal";
import { useSelector, useDispatch } from "react-redux";
// ==============
const Message = ({
  message,
  onLike,
  onAddComment,
  onDeleteComment,
  onDeleteMessage,
}) => {
  // ---------------------
  const [commentText, setCommentText] = useState("");
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [author, setAuthor] = useState(false);
  const [authorComment, setAuthorComment] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  // // ---------------------
  useEffect(() => {
    if (user && user.id === message.author) {
      setAuthor(true);
    }
    if (!user) {
      setAuthor(false);
    }
  }, [user]);
  // // ---------------------

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = () => {
    if (user) {
      if (commentText.trim()) {
        setOpen(false);
        onAddComment(message._id, {
          text: commentText,
          user: user.id,
          name: user.name,
        });
        setCommentText("");
        setOpen(false);
      }
    } else {
      setOpen(false);
      setErrorMessage("Please log in to add a comment. ");
      setTimeout(() => {
        setCommentText("");
        setErrorMessage("");
      }, 2000);
    }
  };
  const handleDeleteComment = (commentId) => {
    onDeleteComment(message._id, commentId);
  };
  const handleDeliteMessage = () => {
    onDeleteMessage(message._id);
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  // ---------------------
  return (
    <>
      <Card className="message-card" style={{ width: "100%" }}>
        <CardContent className="message-card-content">
          {/* Message timestamp */}
          <Typography variant="caption" color="textSecondary" gutterBottom>
            {message.createdAt}
          </Typography>
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
              onClick={() => onLike(message._id, "positive")}
            >
              👍
            </span>
            {message.positiveLikes}

            <span
              className="like-button"
              role="img"
              aria-label="dislike"
              onClick={() => onLike(message._id, "negative")}
            >
              👎
            </span>
            {message.negativeLikes}
            <CommentIcon
              className="comment-icon"
              onClick={handleOpenModal}
              color="primary"
            />
            {author && (
              <DeleteIcon
                color="error"
                className="delete-icon deliteCard"
                onClick={handleDeliteMessage}
              />
            )}
            <Typography variant="h5" color="error" style={{ marginTop: "8px" }}>
              {ErrorMessage}
            </Typography>
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
        handleCloseModal={handleCloseModal}
        handleAddComment={handleAddComment}
        handleCommentChange={handleCommentChange}
        commentText={commentText}
      ></ModalComponent>
    </>
  );
};

export default Message;
