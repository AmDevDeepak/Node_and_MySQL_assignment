const db = require("../models");
const User = db.User;
const Message = db.Message;

const send = async (req, res) => {
  try {
    const senderId = req.id;
    const { receiverId, messageText } = req.body;
    if (!receiverId || !messageText) {
      return res
        .status(400)
        .json({ message: "Receiver ID and message text are required" });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      messageText,
    });
    return res
      .status(201)
      .json({ message: "Message sent successfully!", message });
  } catch (error) {
    console.error("Some error occured while sending the message.", error);
  }
};

const getMessages = async (req, res) => {
  try {
    const receiverId = req.id;
    const messages = await Message.findAll({
      where: { receiverId: receiverId },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["name"],
        },
      ],
    });
    console.log(messages);
    if (!messages || messages.length == 0)
      return res
        .status(404)
        .json({ message: "You haven't received any messages yet." });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Some error occured while fetching the message.", error);
  }
};

const messageFunctions = {
  send,
  getMessages,
};

module.exports = messageFunctions;
