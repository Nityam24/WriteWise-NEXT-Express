const mongoose = require("mongoose");

const ChatGroup = mongoose.model("ChatGroup", {
  name: String,
});

module.exports = ChatGroup;
