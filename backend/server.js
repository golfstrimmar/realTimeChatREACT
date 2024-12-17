import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import multer from "multer";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js"; // Подключаем маршруты для сообщений
import { sendMessage } from "./controllers/messageController.js";
import Message from "./models/Message.js";
import authRoutes from "./routes/authRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
// ===================================
const upload = multer();
dotenv.config();
connectDB();
const app = express();

const server = http.createServer(app);
app.use(express.json());
// ===================================================
// Получаем путь к текущей директории с помощью import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Папка, где будут храниться кэшированные изображения
const imageCachePath = path.join(__dirname, "imageCache");

// Создаем директорию для кэшированных изображений, если она не существует
fs.mkdirSync(imageCachePath, { recursive: true });

// Настройка статического сервера для изображений
// Это будет отдавать файлы из папки imageCache
app.use("/images", express.static(imageCachePath));
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
  socket.emit("receiveMessages");

  socket.on("sendMessage", async (msg) => {
    console.log("new message:", msg);
    try {
      const newMessage = new Message({
        text: msg.text,
      });
      await newMessage.save();
      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("likeMessage", async (id, type) => {
    try {
      const message = await Message.findById(id);

      if (type === "positive") {
        message.positiveLikes += 1;
      } else if (type === "negative") {
        message.negativeLikes += 1;
      }
      await message.save();
      io.emit("updateMessage", message);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  socket.on("addComment", async (id, comment) => {
    try {
      const message = await Message.findById(id);

      if (message) {
        message.comments.push(comment);
        await message.save();
        io.emit("updateMessage", message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });

  // ========deleteMessage
  socket.on("deleteMessage", async (id) => {
    try {
      const deletedMessage = await deleteMessage(id);
      io.emit("removeMessage", id);
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
app.use("/auth", upload.none(), authRoutes);
// ===================================================
// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
