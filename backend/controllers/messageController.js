import Message from "../models/Message.js";

// Контроллер для получения всех сообщений
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

export const sendMessage = async (req, res) => {
  const { text, author, file } = req.body;
  try {
    const newMessage = new Message({
      text,
      author,
      file,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Error saving message" });
  }
};

// export const likeMessage = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const message = await Message.findById(id);
//     if (!message) {
//       return res.status(404).json({ message: "Message not found" });
//     }
//     message.likes += 1;
//     await message.save();
//     res.json(message); // Возвращаем обновленное сообщение
//   } catch (error) {
//     console.error("Error liking message:", error);
//     res.status(500).json({ message: "Error liking message" });
//   }
// };

// export const addComment = async (req, res) => {
//   const { id } = req.params;
//   const { text, user } = req.body;

//   if (!text || !user) {
//     return res.status(400).json({ message: "Text and user are required" });
//   }

//   try {
//     const message = await Message.findById(id);
//     if (!message) {
//       return res.status(404).json({ message: "Message not found" });
//     }
//     message.comments.push({ text, user });
//     await message.save();
//     res.json(message); // Возвращаем сообщение с обновленными комментариями
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     res.status(500).json({ message: "Error adding comment" });
//   }
// };

// export const deleteMessage = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const message = await Message.findById(id);
//     if (!message) {
//       return res.status(404).json({ message: "Message not found" });
//     }
//     await Message.findByIdAndDelete(id);
//     res.status(200).json({ message: "Message deleted" });
//   } catch (error) {
//     console.error("Error deleting message:", error);
//     res.status(500).json({ message: "Error deleting message" });
//   }
// };

export default {
  getMessages,
  sendMessage,
  // likeMessage,
  // addComment,
  // deleteMessage,
};
