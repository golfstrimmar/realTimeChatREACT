import dotenv from "dotenv"; // Импортируем dotenv
dotenv.config(); // Загружаем переменные окружения из .env файла

import express from "express";
import http from "http";
import { Server } from "socket.io"; // Именованный импорт
import { connectDB } from "./config/db.js";
import cors from "cors";

const app = express();
connectDB(); // Подключаем базу данных

// Создаем сервер с использованием http и express
const server = http.createServer(app);

// Создаем экземпляр socket.io
const io = new Server(server); // Используем конструктор Server для создания экземпляра

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Новый маршрут для отображения сообщения о запуске сервера
app.get("/", (req, res) => {
  res.send("<h1>Server is running on port 5000</h1>");
});

// Слушаем сокет-соединения
io.on("connection", (socket) => {
  console.log("User connected");

  // Обработчик для отправки сообщений
  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg); // Отправляем всем пользователям
  });

  // Обработчик для отслеживания отключения
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
