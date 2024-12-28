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

function MessageList({ messages, handleAddComment, handleDeleteComment }) {
  const [page, setPage] = useState(1);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [currentMessages, setCurrentMessages] = useState([]);
  const messagesPerPage = 10;

  const authors = messages.reduce((acc, message) => {
    if (!acc.some((author) => author.author === message.author)) {
      acc.push({ author: message.author, name: message.name });
    }
    return acc;
  }, []);

  // =================== Фильтрация сообщений и пагинация ===================
  useEffect(() => {
    let temp = messages;

    // Фильтрация по выбранному автору
    if (selectedAuthor && selectedAuthor !== "All Authors") {
      temp = messages.filter((message) => message.author === selectedAuthor);
    }

    setFilteredMessages(temp); // Обновляем отфильтрованные сообщения
  }, [selectedAuthor, messages]);

  // =================== Выбор страницы и отображение сообщений ===================
  useEffect(() => {
    const indexOfLastMessage = page * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;

    // Обновляем список сообщений, учитывая пагинацию
    const currentMessages = filteredMessages.slice(
      indexOfFirstMessage,
      indexOfLastMessage
    );
    setCurrentMessages(currentMessages);
  }, [page, filteredMessages]);

  // =================== Обработчики ===================
  const handleChangePage = (event, value) => {
    setPage(value); // Обновляем страницу при изменении
  };

  const handleAuthorChange = (event) => {
    setSelectedAuthor(event.target.value); // Изменяем выбранного автора
    setPage(1); // Сбрасываем страницу на 1, когда меняется автор
  };

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

      {/* Список сообщений */}
      <List className="message-list">
        {currentMessages &&
          currentMessages.map((message, index) => (
            <Message
              key={index}
              message={message}
              onDeleteComment={handleDeleteComment}
            />
          ))}
      </List>

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
