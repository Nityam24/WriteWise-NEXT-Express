const ChatGroup = require("../models/ChatGroup");
const Message = require("../models/Message");

exports.createChatGroup = async (req, res) => {
  const { userId1, name1, userId2, name2 } = req.body;

  try {
    const existingChatGroup = await ChatGroup.findOne({
      $or: [
        { userId1, userId2 },
        { userId1: userId2, userId2: userId1 },
      ],
    });

    if (existingChatGroup) {
      res
        .status(400)
        .json({ error: "ChatGroup already exists for these users" });
      return;
    }

    const newChatGroup = new ChatGroup({ userId1, name1, userId2, name2 });
    await newChatGroup.save();

    res.status(201).json(newChatGroup);
  } catch (err) {
    console.error("Error creating ChatGroup:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getChatGroupMessages = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error retrieving chat messages from MongoDB:", err);
    res.status(500).send("Internal Server Error");
  }
};
