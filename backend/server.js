import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js"; // Подключаем маршруты для сообщений
import { sendMessage } from "./controllers/messageController.js"; // Импортируем контроллер для отправки сообщений
import Message from "./models/Message.js";
// ===================================
// Настроим Express сервер
const app = express();
connectDB(); // Подключаемся к базе данных
const server = http.createServer(app);
app.use(express.json());
// ===================================================
// Настроим Socket.IO сервер
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Разрешаем доступ с фронтенда
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// ===================================================
// Миддлвар для CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===================================
io.on("connection", (socket) => {
  console.log("User connected");

  // Отправка всех сообщений при подключении клиента
  socket.emit("receiveMessages");

  // Обработка отправки нового сообщения
  socket.on("sendMessage", async (msg) => {
    console.log("new message:", msg);
    try {
      const newMessage = new Message({
        text: msg.text, // Сохраняем сообщение в базе данных
      });
      await newMessage.save(); // Сохраняем сообщение в базе данных
      io.emit("receiveMessage", newMessage); // Отправляем новое сообщение всем подключенным клиентам
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Обработка лайка на сообщение
  socket.on("likeMessage", async (id) => {
    try {
      const updatedMessage = await likeMessage(id); // Увеличиваем количество лайков
      io.emit("updateMessage", updatedMessage); // Отправляем обновленное сообщение всем клиентам
    } catch (error) {
      console.error("Error liking message:", error);
    }
  });

  // Обработка добавления комментария
  socket.on("addComment", async (id, comment) => {
    try {
      const updatedMessage = await addComment(id, comment); // Добавляем комментарий
      io.emit("updateMessage", updatedMessage); // Отправляем обновленное сообщение всем клиентам
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });

  // Обработка удаления сообщения
  socket.on("deleteMessage", async (id) => {
    try {
      const deletedMessage = await deleteMessage(id); // Удаляем сообщение
      io.emit("removeMessage", id); // Отправляем всем клиентам ID удаленного сообщения
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
// ===================================
app.use("/messages", messageRoutes);

// ===================================================

// ===================================================
// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
