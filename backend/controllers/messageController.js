import Message from "../models/Message.js";

// Контроллер для получения всех сообщений
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }); // Получаем все сообщения, сортируем по времени
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// Контроллер для сохранения нового сообщения
export const sendMessage = async (msg) => {
  try {
    const newMessage = new Message({
      text: msg,
    });
    await newMessage.save(); // Сохраняем сообщение в базе данных
  } catch (error) {
    console.error("Error saving message:", error);
  }
};
