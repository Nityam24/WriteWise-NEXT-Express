const Message = require("../models/Message");

exports.createMessage = async (req, res) => {
  const { groupId, userId, text } = req.body;

  try {
    const newMessage = new Message({ groupId, userId, text });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error creating Message:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getGroupMessages = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error retrieving chat messages from MongoDB:", err);
    res.status(500).send("Internal Server Error");
  }
};
