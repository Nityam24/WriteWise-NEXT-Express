const Message = require("../schemas/messageSchema");

exports.createMessage = async ({ groupId, userId, text }) => {
  const newMessage = new Message({ groupId, userId, text });

  try {
    await newMessage.save();
    return newMessage;
  } catch (err) {
    console.error("Error creating Message:", err);
    return null;
  }
};

exports.getGroupMessages = async (req, res) => {
  const groupId = req.query.groupId;

  try {
    const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error retrieving chat messages from MongoDB:", err);
    res.status(500).send("Internal Server Error");
  }
};
