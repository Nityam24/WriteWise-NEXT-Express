const ChatGroup = require("../schemas/chatGroupSchema");

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

exports.getUserGroups = async (req, res) => {
  const userId = req.params.userId;

  try {
    const groups = await ChatGroup.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    });
    res.json(groups);
  } catch (err) {
    console.error("Error retrieving user's groups from MongoDB:", err);
    res.status(500).send("Internal Server Error");
  }
};
