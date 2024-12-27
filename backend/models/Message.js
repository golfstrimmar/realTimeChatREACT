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
  positiveLikes: { type: Number, default: 0 },
  negativeLikes: { type: Number, default: 0 },
  comments: [
    {
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      user: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  author: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
