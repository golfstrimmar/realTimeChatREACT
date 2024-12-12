import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js"; // Подключаем маршруты для сообщений
import { sendMessage } from "./controllers/messageController.js"; // Импортируем контроллер для отправки сообщений

// ===================================
const app = express();
connectDB(); // Подключаемся к базе данных
const server = http.createServer(app);

// ===================================================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Разрешаем доступ с фронтенда
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
// ===================================================
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===================================================
app.use("/", messageRoutes); // Подключаем маршруты для API

// ===================================================
// WebSocket обработка подключений и отправки сообщений через Socket.IO
io.on("connection", (socket) => {
  console.log("User connected");

  // Обработка события получения сообщения
  socket.on("sendMessage", async (msg) => {
    try {
      // Сохраняем новое сообщение в базе данных через контроллер
      await sendMessage(msg);

      // Отправляем сообщение всем подключенным клиентам
      io.emit("receiveMessage", msg);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ===================================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
