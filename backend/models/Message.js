import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => {
      return new Date().toLocaleString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
    },
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      user: String,
    },
  ],
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
