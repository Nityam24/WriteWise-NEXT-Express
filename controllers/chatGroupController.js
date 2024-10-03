const ChatGroup = require("../schemas/chatGroupSchema");

exports.createChatGroup = async ({ userId1, name1, userId2, name2 }) => {
  try {
    const existingChatGroup = await ChatGroup.findOne({
      $or: [
        { userId1, userId2 },
        { userId1: userId2, userId2: userId1 },
      ],
    });

    if (existingChatGroup) {
      return existingChatGroup;
    }

    const newChatGroup = new ChatGroup({ userId1, name1, userId2, name2 });
    await newChatGroup.save();

    return newChatGroup;
  } catch (err) {
    console.error("Error creating ChatGroup:", err);
    throw new Error("Internal Server Error");
  }
};

exports.getUserGroups = async (req, res) => {
  const userId = req.query.userId;

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
