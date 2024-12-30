import React, { useState, useEffect } from "react";
import {
  List,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Message from "../Message/Message";
import "./MessageList.scss";
import ModalComponent from "../Modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import { setErrorMessage } from "../../redux/actions/errorActions";
function MessageList({ messages }) {
  const [page, setPage] = useState(1);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [currentMessages, setCurrentMessages] = useState([]);
  const messagesPerPage = 10;
  const [openCommentModal, setOpenCommentModal] = useState();
  const authors = messages.reduce((acc, message) => {
    if (!acc.some((author) => author.author === message.author)) {
      acc.push({ author: message.author, name: message.name });
    }
    return acc;
  }, []);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const socket = useSelector((state) => state.socket.socket);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [commentIdToEdit, setCommentIdToEdit] = useState(null);
  // ========== Фильтрация сообщений и пагинация
  useEffect(() => {
    let temp = messages;
    if (selectedAuthor && selectedAuthor !== "All Authors") {
      temp = messages.filter((message) => message.author === selectedAuthor);
    }

    setFilteredMessages(temp);
  }, [selectedAuthor, messages]);

  // ========= Выбор страницы и отображение сообщений
  useEffect(() => {
    const indexOfLastMessage = page * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;

    const currentMessages = filteredMessages.slice(
      indexOfFirstMessage,
      indexOfLastMessage
    );
    setCurrentMessages(currentMessages);
  }, [page, filteredMessages]);

  // =================== Обработчики ===================
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleAuthorChange = (event) => {
    console.log(event.target.value);
    if (event.target.value) {
      setSelectedAuthor(event.target.value);
    }
    setPage(1);
  };
  // -------------------------
  const handelOpenCommentModal = (message) => {
    console.log("message", message);
    if (!user) {
      dispatch(setErrorMessage("Please log in to add a comment."));
    } else {
      setOpenCommentModal(true);
      setCurrentMessage(message);
    }
  };

  // -------------------------
  const handleDeleteComment = (message, commentId) => {
    console.log("delete comment:", message, commentId);
    socket.emit("deleteComment", message._id, commentId);
  };
  // -------------------------
  const handleEditComment = (message, commentId) => {
    console.log("edit comment:", message, commentId);
    setOpenCommentModal(true);
    setCurrentMessage(message);
    setCommentIdToEdit(commentId);
  };
  // -------------------------
  return (
    <div>
      {/* Селектор для выбора автора */}
      <FormControl fullWidth>
        <InputLabel id="simple-select-label">Choose an Author</InputLabel>
        <Select
          labelId="simple-select-label"
          value={selectedAuthor}
          onChange={handleAuthorChange}
          label="Choose an Author"
          className="author-select"
        >
          <MenuItem value="All Authors">All Authors</MenuItem>
          {authors.map((el, index) => (
            <MenuItem key={index} value={el.author}>
              {el.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/*===========message-list============= */}
      <List className="message-list">
        {currentMessages &&
          currentMessages.map((message, index) => (
            <Message
              key={index}
              message={message}
              handleDeleteComment={handleDeleteComment}
              handelOpenCommentModal={handelOpenCommentModal}
              handleEditComment={handleEditComment}
            />
          ))}
      </List>
      {/* ====================================== */}
      <ModalComponent
        className="CommentModal"
        openCommentModal={openCommentModal}
        setOpenCommentModal={setOpenCommentModal}
        currentMessage={currentMessage}
        commentIdToEdit={commentIdToEdit}
        setCommentIdToEdit={setCommentIdToEdit}
      />
      {/* Пагинация */}
      <Pagination
        count={Math.ceil(filteredMessages.length / messagesPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
        shape="rounded"
        size="small"
        sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
      />
    </div>
  );
}

export default MessageList;
