const mongoose = require("mongoose");

const Message = mongoose.model("Message", {
  groupId: String,
  userId: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, default: Date.now, index: { expires: "10s" } },
});

module.exports = Message;
