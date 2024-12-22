import express from "express";
import {
  getMessages,
  sendMessage,
  // likeMessage,
  // addComment,
  // deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/", getMessages);
router.post("/", sendMessage);

// router.patch("/:id/like", likeMessage);

// router.post("/:id/comments", addComment);

// router.delete("/:id", deleteMessage);

export default router;
