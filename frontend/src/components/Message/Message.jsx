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
import { useSelector, useDispatch } from "react-redux";
import {
  setEditMessage,
  setDeliteMessage,
} from "../../redux/actions/messageActions";
import "./Message.scss";
// ==============
const Message = ({
  message,
  handelOpenCommentModal,
  handleDeleteComment,
  handleEditComment,
}) => {
  // ---------------------
  const [author, setAuthor] = useState(false);
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

  // ---------------------

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
              <>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  gutterBottom
                  className="message-author"
                >
                  {message.name}
                </Typography>
                {/* </Tooltip> */}
              </>
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
              onClick={() => handelOpenCommentModal(message)}
              color="primary"
            />
            {/* Edit*/}
            {author && (
              <EditIcon className="message-icon" onClick={handleEditMessage} />
            )}
            {/* Delete*/}
            {author && (
              <DeleteIcon
                color="error"
                className="message-icon"
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
            <p className="comments-title">Comments:</p>
            {message.comments.length > 0 ? (
              message.comments.map((comment, index) => (
                <div key={index} className="comments">
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
                    <div>
                      {user && comment.user === user.id && (
                        <EditIcon
                          className="message-icon"
                          onClick={() => {
                            handleEditComment(message, comment._id);
                          }}
                        />
                      )}
                      {user && comment.user === user.id && (
                        <DeleteIcon
                          color="error"
                          className="message-icon"
                          onClick={() =>
                            handleDeleteComment(message, comment._id)
                          }
                        />
                      )}
                    </div>
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
    </>
  );
};

export default Message;
