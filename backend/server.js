import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import multer from "multer";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js"; // Подключаем маршруты для сообщений
// import { sendMessage } from "./controllers/messageController.js";
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
app.use(express.urlencoded({ extended: true }));
// let onlineUsers = [];
let onlineUsers = [];
let connectionId = null;
let userIndex = null;
let currentUser = null;
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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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

// app.use((req, res, next) => {
//   console.log(
//     `Incoming request: method=${req.method} url=${req.url}
//     body=${JSON.stringify(req.body, null, 2)}`
//   );
//   next();
// });
// ===================================
io.on("connection", (socket) => {
  console.log(`**Connection id:** ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`**Connection interrapted:** ${socket.id}`);
  });
});
// ===================================
io.on("connection", (socket) => {
  socket.emit("receiveMessages");
  socket.emit("onlineUsers", onlineUsers);
  socket.on("sendMessage", async (msg) => {
    try {
      const newMessage = new Message({
        text: msg.text,
        author: msg.author,
        file: msg.file,
      });
      console.log("new message socket:", newMessage);
      await newMessage.save();
      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error sending message socket:", error);
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
  socket.on("deleteComment", (messageId, commentId) => {
    Message.findById(messageId).then((message) => {
      if (message) {
        message.comments = message.comments.filter(
          (comment) => comment._id.toString() !== commentId
        );
        message.save().then((updatedMessage) => {
          io.emit("updateMessage", updatedMessage);
          io.emit("deleteComment", messageId, commentId);
        });
      }
    });
  });
  socket.on("deleteMessage", async (id) => {
    try {
      const message = await Message.findByIdAndDelete(id);
      if (!message) {
        console.log("Message not found");
      } else {
        io.emit("deleteMessage", id);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });
  socket.on("userConnected", (name) => {
    userIndex = onlineUsers.findIndex((user) => user.name === name);
    currentUser = onlineUsers[userIndex];
    if (userIndex == -1) {
      onlineUsers.push({ name: name, count: 0 });
    }

    if (currentUser && connectionId == socket.id) {
      currentUser.count += 1;
    }

    connectionId = socket.id;
    console.log("====================");
    console.log(`User - ${name} - connected`);
    console.log("connectionId:", connectionId);
    console.log("socket.id:", socket.id);
    console.log("userIndex:", userIndex);
    console.log("onlineUsers[userIndex]:", onlineUsers[userIndex]);
    console.log("Online users:", onlineUsers);
    console.log("Current user:", currentUser);
    console.log("====================");
    io.emit("onlineUsers", onlineUsers);
  });

  // socket.on("disconnectUser", (name) => {
  //   const user = onlineUsers.find((user) => user.name === name);
  //   // console.log("user before disconnected", user, user.count);
  //   if (user && user.count > 0) {
  //     user.count -= 1;
  //   }

  //   if (user && user.count === 0) {
  //     onlineUsers = onlineUsers.filter((user) => user.name !== name);
  //   }
  //   console.log(`User---${name}---- disconnected: `);
  //   console.log("Online users:", onlineUsers);
  //   io.emit("onlineUsers", onlineUsers);
  // });

  socket.on("disconnectUser", () => {
    if (currentUser) {
      if (currentUser.count > 0) {
        currentUser.count -= 1;
      }

      if (currentUser.count === 0) {
        onlineUsers = onlineUsers.filter((user) => user !== currentUser);
      }
      console.log(`User---${currentUser.name}---- disconnected: `);
    }

    console.log("Online users:", onlineUsers);
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    // if (currentUser) {
    //   console.log(`socket.id---${currentUser.name}--- disconnected `);

    //   if (currentUser.count > 0) {
    //     currentUser.count -= 1;
    //   }

    // if (currentUser && currentUser.count === 0) {
    //   onlineUsers = onlineUsers.filter((user) => user !== currentUser);
    // }
    // }
    io.emit("onlineUsers", onlineUsers);
  });
});
// ===================================
app.use("/messages", upload.none(), messageRoutes);

// ===================================================
app.use("/auth", upload.none(), authRoutes);
// ===================================================

// ===================================================
// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
