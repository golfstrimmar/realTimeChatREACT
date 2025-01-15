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
import { Types } from "mongoose";
const { ObjectId } = Types;
import { v4 as uuidv4 } from "uuid";
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
let userSocketMap = [];
// ===================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageCachePath = path.join(__dirname, "imageCache");
fs.mkdirSync(imageCachePath, { recursive: true });
app.use("/images", express.static(imageCachePath));
// ===================================================
const io = new Server(server, {
  cors: {
    // origin: "https://real-time-chat-react-sigma.vercel.app",
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// ===================================================
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://real-time-chat-react-sigma.vercel.app",
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
  console.log(`*******************************************************`);
  console.log(`*+*on Connection id:*+* ${socket.id}`);
  console.log("*+* on Connection userSocketMap*+*", userSocketMap);
  console.log(
    "*+*Online users:*+*",
    onlineUsers.map((el) => ({ name: el.user?.name, count: el?.count }))
  );

  socket.emit("receiveMessages");
  socket.emit("onlineUsers", onlineUsers);
  // ==================sendMessage===============================
  socket.on("sendMessage", async (msg) => {
    try {
      const newMessage = new Message({
        text: msg.text,
        author: msg.author,
        file: msg.file,
        name: msg.name,
      });
      console.log("new message socket:", newMessage);
      await newMessage.save();
      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error sending message socket:", error);
    }
  });
  // =====updateMessage========
  socket.on("updateMessage", async (updatedMessageData) => {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        updatedMessageData._id,
        {
          text: updatedMessageData.text,
          file: updatedMessageData.file,
          author: updatedMessageData.author,
          name: updatedMessageData.name,
        },
        { new: true } // Возвращаем обновленное сообщение
      );

      if (!updatedMessage) {
        socket.emit("error", "Message not found.");
        return;
      }

      console.log("**********Updated message:************", updatedMessage);
      io.emit("receiveMessage", updatedMessage);
    } catch (error) {
      console.error("Error updating message:", error);
      socket.emit("error", "Failed to update message.");
    }
  });
  // ======deleteMessage======
  socket.on("deleteMessage", async (mes) => {
    try {
      const message = await Message.findByIdAndDelete(mes);
      if (!message) {
        console.log("Message not found");
      } else {
        console.log("--Message deleted--:", message);
        io.emit("deleteMessage", mes);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });
  // ============likeMessage
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
  // ============addComment
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
  // ============commentToEdit
  socket.on("commentToEdit", (currentMessageId, commentIdToEdit) => {
    console.log("Received data:", currentMessageId, commentIdToEdit);
    Message.findById(currentMessageId)
      .then((message) => {
        if (message) {
          let comment = null;
          message.comments.forEach((el) => {
            if (
              (el) => JSON.stringify(el._id) === JSON.stringify(commentIdToEdit)
            ) {
              console.log("Found comment:", el);
              return (comment = el);
            }
          });

          if (comment) {
            comment.text = commentIdToEdit.text;
            message.save().then((updatedMessage) => {
              io.emit("updateMessage", updatedMessage);
            });
          }
        } else {
          console.log("Message not found with id:", currentMessageId);
        }
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  });
  // ============deleteComment
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
  // ============
  socket.on("sendPrivatMessage", async (data) => {
    const { text, from, to, file } = data;
    const messageId = uuidv4();
    try {
      const sender = await User.findById(from.id);
      sender.correspondence.push({
        _id: messageId,
        text: text,
        from: from.id,
        to: to._id,
        file: file,
        status: "sent",
      });
      await sender.save();

      const receiver = await User.findById(to._id);
      receiver.correspondence.push({
        _id: messageId,
        text: text,
        from: from.id,
        to: to._id,
        file: file,
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

      let fromSocket = userSocketMap.filter((el) => el.user === from.id);
      let toSocket = userSocketMap.filter((el) => el.user === to._id);

      fromSocket.forEach((el) => {
        io.to(el.socket).emit("UserData", updatedSender);
        console.log(`сообщение отправлено в сокет ${el.socket}`);
      });
      toSocket.forEach((el) => {
        io.to(el.socket).emit("UserData", updatedReceiver);
        console.log(`сообщение отправлено в сокет ${el.socket}`);
      });

      io.emit("newMessageNotification", {
        text,
        from,
        to,
      });
    } catch (error) {
      console.error("Error saving private message:", error);
    }
  });
  // ============
  socket.on("delitePrivatMessage", async (mes) => {
    const { from, to, text, _id } = mes;
    console.log("PrivatMessage to delite id", _id);
    try {
      const sender = await User.findById(from._id);
      let PrivatMessage = null;
      sender.correspondence.forEach((el) => {
        if (JSON.stringify(el._id) === JSON.stringify(_id)) {
          return (PrivatMessage = el);
        }
      });
      sender.correspondence = sender.correspondence.filter(
        (el) => el !== PrivatMessage
      );
      await sender.save();
      //  ----

      //  ----
      let PrivatMessagereceiver = null;
      const receiver = await User.findById(to._id);
      console.log("====receiver", receiver);
      receiver.correspondence.forEach((el) => {
        if (JSON.stringify(el._id) === JSON.stringify(_id)) {
          return (PrivatMessagereceiver = el);
        }
      });
      console.log("==========PrivatMessage receiver", PrivatMessagereceiver);
      receiver.correspondence = receiver.correspondence.filter(
        (el) => el !== PrivatMessagereceiver
      );
      await receiver.save();
      //  ----

      const updatedSender = await User.findById(from._id)
        .populate("correspondence.from", "name")
        .populate("correspondence.to", "name")
        .select("-password");
      const updatedReceiver = await User.findById(to._id)
        .populate("correspondence.from", "name")
        .populate("correspondence.to", "name")
        .select("-password");

      let fromSocket = userSocketMap.filter((el) => el.user === from._id);
      let toSocket = userSocketMap.filter((el) => el.user === to._id);

      fromSocket.forEach((el) => {
        io.to(el.socket).emit("UserData", updatedSender);
        console.log(`сообщение отправлено в сокет ${el.socket}`);
      });
      toSocket.forEach((el) => {
        io.to(el.socket).emit("UserData", updatedReceiver);
        console.log(`сообщение отправлено в сокет ${el.socket}`);
      });
    } catch (error) {
      console.error("Error saving private message:", error);
    }
  });
  // ============
  socket.on("newUser", async (formData) => {
    console.log("========newUser", formData);
    const users = await User.find().select("-password");
    console.log("=======users", users);
    try {
      const users = await User.find().select("-password");
      users = [...users, formData];
      console.log("++++users", users);
      io.emit("Users", users);
    } catch (error) {
      console.error("Error fetching users:", error);
      socket.emit("error", "Unable to fetch users");
    }
    io.emit("Users", users);
  });
  // ============
  socket.on("allUsers", async () => {
    try {
      const users = await User.find().select("-password");
      io.emit("Users", users);
    } catch (error) {
      console.error("Error fetching users:", error);
      socket.emit("error", "Unable to fetch users");
    }
  });
  // ============
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
  // =================================================
  socket.on("clearAll", async () => {
    console.log("clearAll");
    try {
      const users = await User.find().select("-password");
      for (const user of users) {
        user.correspondence = [];
        await user.save();
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      socket.emit("error", "Unable to fetch users");
    }
  });
  // =================================================
  socket.on("ClearChat", async (idUser, idReciver) => {
    // console.log("idUser", idUser, ",idReciver", idReciver);
    try {
      const user = await User.findById(idUser).select("-password");
      const reciver = await User.findById(idReciver).select("-password");
      let userCorr = user.correspondence;
      let reciverCorr = reciver.correspondence;

      userCorr = userCorr.map((el) => {
        const doc = el.toObject ? el.toObject() : el;
        if (
          doc.from.toString() === idReciver ||
          doc.to.toString() === idReciver
        ) {
          return { ...doc, status: "archived" };
        }
        return doc;
      });
      reciverCorr = reciverCorr.map((el) => {
        const doc = el.toObject ? el.toObject() : el;
        if (doc.from.toString() === idUser || doc.to.toString() === idUser) {
          return { ...doc, status: "archived" };
        }
        return doc;
      });
      user.correspondence = userCorr;
      reciver.correspondence = reciverCorr;
      await user.save();
      await reciver.save();
      // -------------------
      let inUser = userSocketMap.filter((el) => el.user === idUser);
      let inReciver = userSocketMap.filter((el) => el.user === idReciver);

      inUser.forEach((el) => {
        io.to(el.socket).emit("UserData", user);
        console.log(`сообщение отправлено в сокет ${el.socket}`);
      });
      inReciver.forEach((el) => {
        io.to(el.socket).emit("UserData", reciver);
        console.log(`сообщение отправлено в сокет ${el.socket}`);
      });
      // -------------------
    } catch (error) {
      console.error("Error fetching users:", error);
      socket.emit("error", "Unable to fetch users");
    }
  });
  // ++++==============userConnected==============
  socket.on("userConnected", (user, socketId) => {
    userSocketMap.push({
      userName: user.name,
      user: user.id,
      socket: socketId,
    });

    let map = new Map();
    userSocketMap.forEach((item) => {
      map.set(item.user + item.socket, item);
    });

    userSocketMap = Array.from(map.values());
    userSocketMap.filter((el) => el.socket !== socket.id);
    userIndex = onlineUsers.findIndex((el) => el.user.id === user.id);
    currentUser = onlineUsers[userIndex];
    connectionId = socket.id;
    if (userIndex == -1) {
      onlineUsers.push({ user: user, count: 1 });
    }

    if (userIndex == 0 && currentUser && connectionId == socket.id) {
      currentUser.count += 1;
    }
    // console.log("*****on userConnected****", user.id, socketId);
    // console.log(
    //   `User connected -name: ${user.name} - connectionId: ${connectionId} -socket.id: ${socket.id}`
    // );
    // console.log("Current user:", currentUser);
    console.log("*********");
    console.log("***on user Connected socket.id***", socket.id);
    console.log(
      "**on user Connected Online users:**",
      onlineUsers.map((el) => ({ name: el.user?.name, count: el?.count }))
    );
    console.log("**on user Connected userSocketMap**", userSocketMap);
    console.log("====================");

    io.emit("onlineUsers", onlineUsers);
  });
  // =================================================
  socket.on("userRefresh", (user, socketId) => {
    console.log("**** on  userRefresh:****", user.name, socket.id);
    userSocketMap.push({
      userName: user.name,
      user: user.id,
      socket: socketId,
    });
    let userIndex = onlineUsers.findIndex((el) => el.user.id === user.id);
    if (userIndex == -1) {
      onlineUsers.push({ user: user, count: 1 });
    } else {
      onlineUsers[userIndex].count += 1;
    }
    io.emit("onlineUsers", onlineUsers);
    console.log("**Online users userRefresh:**", onlineUsers);
    console.log("**userSocketMap on  userRefresh**", userSocketMap);
  });
  // =================================================
  socket.on("disconnectUser", (user) => {
    console.log(
      "************",
      "**** on  disconnectUser:****",
      user.name,
      socket.id,
      userSocketMap
    );

    userSocketMap = userSocketMap.filter((item) => item.socket !== socket.id);

    const current = onlineUsers.find((el) => el.user.id === user.id);
    if (current && current.count > 0) {
      current.count -= 1;
    }
    if (current && current.count === 0) {
      onlineUsers = onlineUsers.filter((el) => el.user.id !== current.user.id);
      for (let userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
    }
    console.log(
      "**Online users:**",
      onlineUsers.map((el) => {
        el.user?.name, el?.count;
      })
    );
    console.log("***userSocketMap after disconnectUser ***", userSocketMap);
    io.emit("onlineUsers", onlineUsers);
  });
  // =================================================
  socket.on("disconnect", () => {
    const userInMap = userSocketMap.find((el) => el.socket == socket.id);
    let current;
    if (userInMap) {
      current = onlineUsers.find((el) => el.user.id === userInMap.user);
    }

    if (current) {
      current.count -= 1;
      if (current.count === 0) {
        onlineUsers = onlineUsers.filter(
          (el) => el.user.id !== current.user.id
        );
      }
    }
    userSocketMap = userSocketMap.filter((el) => el.socket !== socket.id);
    console.log(`*************`);
    console.log(`*-*on  disconnect: socket.id,- ${socket.id} interrapted:*-* `);
    console.log(
      "*-*on  disconnect: Online users:*-*",
      onlineUsers.map((el) => ({ name: el.user?.name, count: el?.count }))
    );
    console.log("*-*on  disconnect: userSocketMap*-*", userSocketMap);
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
