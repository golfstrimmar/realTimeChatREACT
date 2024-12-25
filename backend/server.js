import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import multer from "multer";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js";
// import { sendMessage } from "./controllers/messageController.js";
import Message from "./models/Message.js";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
const userSocketMap = {};
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
  socket.on("userConnected", (user, socketId) => {
    console.log(user.id, socketId);
    userSocketMap[user.id] = socketId;
    userIndex = onlineUsers.findIndex((el) => el.user.id === user.id);
    currentUser = onlineUsers[userIndex];
    connectionId = socket.id;
    if (userIndex == -1) {
      onlineUsers.push({ user: user, count: 1 });
    }

    if (userIndex == 0 && currentUser && connectionId == socket.id) {
      currentUser.count += 1;
    }
    // connectionId = socket.id;
    // onlineUsers = onlineUsers.filter((el) => el.count !== 0);
    console.log("====================");
    console.log(
      `User connected -name: ${user.name} - connectionId: ${connectionId} -socket.id: ${socket.id}`
    );
    console.log("Current user:", currentUser);
    console.log("Online users:", onlineUsers);
    console.log("====================");

    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("disconnectUser", (user) => {
    console.log("****Online users (disconnectUser):****", onlineUsers);
    const current = onlineUsers.find((el) => el.user.id === user.id);
    if (current && current.count > 0) {
      current.count -= 1;
    }
    if (current && current.count === 0) {
      onlineUsers = onlineUsers.filter((el) => el.user.id !== current.user.id);
    }
    console.log(`User---${user.name}---- disconnected: `);
    console.log("****Online users (disconnectUser):****", onlineUsers);
    io.emit("onlineUsers", onlineUsers);
  });
  socket.on("sendPrivatMessage", async (data) => {
    const { text, from, to } = data;
    console.log("text:", text);
    console.log("from:", from);
    console.log("to:", to);
    try {
      const sender = await User.findById(from.id);
      console.log("sender:", sender);
      sender.correspondence.push({
        text,
        from: from.id,
        to: to._id,
        status: "sent",
      });
      await sender.save();

      const receiver = await User.findById(to._id);
      console.log("receiver:", receiver);
      receiver.correspondence.push({
        text,
        from: from.id,
        to: to._id,
        status: "received",
      });
      await receiver.save();

      console.log("Private message saved:", data);
      const updatedSender = await User.findById(from.id)
        .populate("correspondence.from", "name")
        .populate("correspondence.to", "name")
        .select("-password");
      const updatedReceiver = await User.findById(to._id)
        .populate("correspondence.from", "name")
        .populate("correspondence.to", "name")
        .select("-password");

      io.to(userSocketMap[from.id]).emit("UserData", updatedSender);
      io.to(userSocketMap[to._id]).emit("UserData", updatedReceiver);

      io.emit("newMessageNotification", {
        text,
        from,
        to,
      });
    } catch (error) {
      console.error("Error saving private message:", error);
    }
  });

  socket.on("allUsers", async () => {
    try {
      const users = await User.find().select("-password");
      io.emit("Users", users);
    } catch (error) {
      console.error("Error fetching users:", error);
      socket.emit("error", "Unable to fetch users");
    }
  });
  socket.on("User", async (id) => {
    try {
      const userToFind = await User.findById(id)
        .populate("correspondence.from", "name")
        .populate("correspondence.to", "name")
        .select("-password");

      console.log("userToFind", userToFind);
      io.to(socket.id).emit("UserData", userToFind);
    } catch (error) {
      console.error("Error fetching users:", error);
      socket.emit("error", "Unable to fetch users");
    }
  });

  socket.on("ClearChat", async (idUser, idReciver) => {
    try {
      const user = await User.findById(idUser).select("-password");
      const reciver = await User.findById(idReciver).select("-password");
      user.correspondence = [];
      reciver.correspondence = [];
      await user.save();
      await reciver.save();
      io.emit("UserData", user);
      io.emit("UserData", reciver);
    } catch (error) {
      console.error("Error fetching users:", error);
      socket.emit("error", "Unable to fetch users");
    }
  });

  socket.on("disconnect", () => {
    // onlineUsers = onlineUsers.filter((el) => el.count !== 0);
    // for (let userId in userSocketMap) {
    //   if (userSocketMap[userId] === socket.id) {
    //     delete userSocketMap[userId];
    //     break;
    //   }
    // }
    // console.log("userSocketMap", userSocketMap);
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
