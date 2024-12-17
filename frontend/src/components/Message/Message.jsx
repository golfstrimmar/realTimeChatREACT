import React, { useState } from "react";
import {
  Typography,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Divider,
  Modal,
} from "@mui/material";
import "./Message.scss";
import ModalComponent from "../Modal/Modal";
// ==============
const Message = ({ message, onLike, onAddComment }) => {
  // ---------------------
  const [commentText, setCommentText] = useState("");
  const [open, setOpen] = useState(false);
  // // ---------------------
  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      setOpen(false);
      onAddComment(message._id, { text: commentText, user: "Anonymous" });
      setCommentText("");
      setOpen(false);
    }
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
      <ListItem className="message" style={{ marginBottom: "16px" }}>
        <Card style={{ width: "100%" }}>
          <CardContent>
            {/* Message timestamp */}
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {message.createdAt}
            </Typography>

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
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "bold", display: "inline" }}
                    >
                      {comment.user}:
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ display: "inline", marginLeft: "8px" }}
                    >
                      {comment.text}
                    </Typography>
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
            <Button onClick={handleOpenModal}>Add comment</Button>
          </CardContent>
        </Card>
      </ListItem>
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
