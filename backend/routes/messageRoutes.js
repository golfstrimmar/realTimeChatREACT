import express from "express";
import { getMessages } from "../controllers/messageController.js";

const router = express.Router();

// Маршрут для получения всех сообщений
router.get("/messages", getMessages);

export default router;
